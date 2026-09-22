/**
 * Shared scheduling rules, used by both the public calendar and the API that
 * validates what it sends back. Keeping one copy matters more than usual here:
 * if the two ever disagreed about whether a slot is free, the visitor would be
 * shown a time they cannot actually book.
 *
 * Everything is UTC milliseconds. The only local time in the system is the
 * owner's recurring weekly blocks, and that is deliberate — "every Thursday at
 * 6pm" means 6pm in Ottawa in both June and December, which is two different
 * UTC hours. Stored as UTC they would drift by an hour twice a year.
 */

export const SLOT_MINUTES = 20;
export const SLOT_MS = SLOT_MINUTES * 60_000;

/** Where the owner actually is. Recurring blocks are expressed in this zone. */
export const OWNER_TZ = "America/Toronto";

/** How far ahead the calendar offers slots. */
export const HORIZON_DAYS = 21;

/**
 * How soon from now a slot can be booked. Long enough that a booking made at
 * 3am isn't for 3:20am, short enough to still feel immediate.
 */
export const LEAD_TIME_MINUTES = 120;

/**
 * The slot grid is anchored to the UTC epoch, not to anyone's local midnight.
 *
 * Anchoring per-visitor was the first instinct and it is quietly broken: India
 * is UTC+5:30 and Nepal is +5:45, so a grid built from local midnight there
 * lands on different instants than one built from local midnight in Ottawa.
 * Two visitors could then book slots that overlap without colliding on any
 * single start time, and the database's uniqueness check would never fire.
 * One global grid makes overlap impossible to express.
 */
export function isOnGrid(ms: number): boolean {
  return Number.isFinite(ms) && ms % SLOT_MS === 0;
}

/** Next grid instant at or after `ms`. */
export function ceilToGrid(ms: number): number {
  return Math.ceil(ms / SLOT_MS) * SLOT_MS;
}

export type Block = {
  id?: number;
  weekday: number; // 0 = Sunday
  start_min: number; // minutes from local midnight
  end_min: number; // exclusive; may exceed 1440 to run past midnight
  label?: string | null;
};

export type Exception = {
  id?: number;
  starts_at: string; // UTC ISO
  ends_at: string; // UTC ISO
  label?: string | null;
};

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

export const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Constructing an Intl.DateTimeFormat is the expensive part, not using one, and
// the calendar asks about roughly 1,500 slots on load. Build it once.
let ownerFormatter: Intl.DateTimeFormat | null = null;

function getOwnerFormatter(): Intl.DateTimeFormat {
  if (!ownerFormatter) {
    ownerFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: OWNER_TZ,
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      // h23 rather than hour12:false — the latter renders midnight as "24" in
      // some environments, which would put every midnight slot on the wrong day.
      hourCycle: "h23",
    });
  }
  return ownerFormatter;
}

/** The owner's local weekday and minutes-past-midnight for a UTC instant. */
export function ownerLocalParts(ms: number): { weekday: number; minutes: number } {
  const parts = getOwnerFormatter().formatToParts(new Date(ms));
  let weekday = 0;
  let hour = 0;
  let minute = 0;
  for (const part of parts) {
    if (part.type === "weekday") weekday = WEEKDAY_INDEX[part.value] ?? 0;
    else if (part.type === "hour") hour = Number(part.value);
    else if (part.type === "minute") minute = Number(part.value);
  }
  return { weekday, minutes: hour * 60 + minute };
}

/**
 * Whether a slot starting at `ms` collides with any busy rule.
 *
 * Tests overlap, not containment: a slot is unavailable if any part of it falls
 * inside a block, so a block ending at 18:10 still takes the 18:00 slot.
 */
export function isBlocked(ms: number, blocks: Block[], exceptions: Exception[]): boolean {
  const slotEnd = ms + SLOT_MS;

  for (const exception of exceptions) {
    const start = Date.parse(exception.starts_at);
    const end = Date.parse(exception.ends_at);
    if (Number.isNaN(start) || Number.isNaN(end)) continue;
    if (ms < end && slotEnd > start) return true;
  }

  if (blocks.length === 0) return false;

  const { weekday, minutes } = ownerLocalParts(ms);
  const endMinutes = minutes + SLOT_MINUTES;
  const previousWeekday = (weekday + 6) % 7;

  for (const block of blocks) {
    if (block.weekday === weekday && minutes < block.end_min && endMinutes > block.start_min) {
      return true;
    }

    // The tail of a block that started yesterday and ran past midnight.
    if (block.weekday === previousWeekday && block.end_min > 1440) {
      const wrappedStart = Math.max(0, block.start_min - 1440);
      const wrappedEnd = block.end_min - 1440;
      if (minutes < wrappedEnd && endMinutes > wrappedStart) return true;
    }
  }

  return false;
}

/** "18:00" / "6:00 PM" style minute-of-day helpers for the admin UI. */
export function minutesToTimeValue(minutes: number): string {
  const wrapped = ((minutes % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function timeValueToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

export function formatBlockRange(block: Block): string {
  const end = block.end_min > 1440 ? `${minutesToTimeValue(block.end_min)} (next day)` : minutesToTimeValue(block.end_min);
  return `${minutesToTimeValue(block.start_min)} – ${end}`;
}
