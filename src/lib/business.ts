// Single source of truth for contact identity, so a number or a name change
// is one edit rather than a hunt through every page.

export const PHONE_DISPLAY = "613-513-7243";
export const PHONE_HREF = "tel:+16135137243";
export const EMAIL = "info@mgrdigitalstudio.com";
export const EMAIL_HREF = `mailto:${EMAIL}`;

export const BRAND_NAME = "MGR Digital Studio";

export const CITY = "Ottawa, Ontario";
export const ADDRESS_STREET = "702 Maloja Way, Stittsville";
export const ADDRESS_LOCALITY = "Ottawa";
export const ADDRESS_REGION = "ON";
export const ADDRESS_POSTAL_CODE = "K2S 0N6";
export const ADDRESS_COUNTRY = "CA";

/**
 * Availability, not office hours. The booking calendar genuinely offers every
 * 20-minute slot around the clock, so a 9-to-5 line underneath it was both
 * wrong and the thing most likely to lose an overseas enquiry — someone in
 * Madrid or Mexico City reads "9-5 ET" and closes the tab.
 *
 * This is deliberately about *calls*, which are scheduled. Reply time on email
 * is a separate promise and stays a business day, because that one is kept by
 * a person rather than by a calendar.
 */
export const HOURS = "Calls 24/7 — book any time, from any time zone";
export const HOURS_LONG =
  "Book a call any hour of any day. I work with clients across Canada, the U.S. and further afield, so pick whatever time suits you — I'll make it work.";

/**
 * Set to true once a real photo is saved at public/marcos.jpg. Until then the
 * About page renders a monogram rather than shipping a broken image.
 */
export const HAS_PORTRAIT = true;
export const PORTRAIT_SRC = "/marcos.jpg";
