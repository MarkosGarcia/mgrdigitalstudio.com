-- mgrdigitalstudio.com lead CRM schema (Cloudflare D1 / SQLite)
-- Apply with: wrangler d1 execute mgrdigitalstudio-leads --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  source TEXT NOT NULL,
  name TEXT,
  email TEXT,
  phone TEXT,
  business_name TEXT,
  website_url TEXT,
  industry TEXT,
  location TEXT,
  primary_goal TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);

-- ---------------------------------------------------------------------------
-- Discovery-call booking.
--
-- Every instant is stored in UTC. The only thing kept in local time is the
-- recurring weekly busy rules, and deliberately so: "every Thursday 6pm" means
-- 6pm in Ottawa in both June and December, which is two different UTC hours.
-- Storing those as UTC would silently shift them by an hour twice a year.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  starts_at TEXT NOT NULL,                    -- UTC ISO, always on a 20-min boundary
  duration_min INTEGER NOT NULL DEFAULT 20,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  visitor_tz TEXT,                            -- what the visitor saw it as
  mode TEXT NOT NULL DEFAULT 'video',         -- 'video' | 'phone'
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed'    -- 'confirmed' | 'cancelled'
);

-- The database, not the application, is what actually prevents double-booking.
-- Partial, so cancelling a booking releases its slot for someone else.
CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_slot
  ON bookings (starts_at) WHERE status = 'confirmed';
CREATE INDEX IF NOT EXISTS idx_bookings_starts_at ON bookings (starts_at);

-- Recurring weekly busy blocks, in the owner's local time.
-- weekday: 0=Sunday .. 6=Saturday.
-- start_min/end_min: minutes from local midnight. end_min may exceed 1440 to
-- express a block that runs past midnight (e.g. Fri 22:00-02:00 is 1320..1560).
CREATE TABLE IF NOT EXISTS availability_blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  weekday INTEGER NOT NULL,
  start_min INTEGER NOT NULL,
  end_min INTEGER NOT NULL,
  label TEXT
);

-- One-off unavailable ranges — a trip, a holiday, a day that broke the pattern.
CREATE TABLE IF NOT EXISTS availability_exceptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  starts_at TEXT NOT NULL,                    -- UTC ISO
  ends_at TEXT NOT NULL,                      -- UTC ISO
  label TEXT
);

CREATE INDEX IF NOT EXISTS idx_exceptions_range
  ON availability_exceptions (starts_at, ends_at);
