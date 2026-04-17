/**
 * Authenticated shell spacing — keep in sync with AppHeader Toolbar + App.tsx <main>.
 * AppHeader Toolbar: minHeight xs 64px, md+ 70px (see AppHeader.tsx).
 */
export const HEADER_HEIGHT_XS = 64;
export const HEADER_HEIGHT_MD_UP = 70;
/** Visual height of fixed BottomNav (icons + labels + padding) — 80px was too small on real devices */
export const BOTTOM_NAV_HEIGHT = 96;

/** Extra scroll inset so the last row of content clears the nav (avoids half-visible cards + table pagination) */
export const AUTH_MAIN_BOTTOM_SCROLL_BUFFER_PX = 56;

/** Gap between fixed chrome and scrollable content */
export const AUTH_MAIN_CHROME_GAP_PX = 16;

/** Padding inside <main> below fixed AppBar + gap (legacy single breakpoint — prefer responsive in App.tsx) */
export const AUTH_MAIN_PADDING_TOP_PX = HEADER_HEIGHT_MD_UP + AUTH_MAIN_CHROME_GAP_PX;

/** Padding inside <main> above fixed BottomNav + gap + buffer */
export const AUTH_MAIN_PADDING_BOTTOM_PX =
  BOTTOM_NAV_HEIGHT + AUTH_MAIN_CHROME_GAP_PX + AUTH_MAIN_BOTTOM_SCROLL_BUFFER_PX;

/**
 * Full-height routes (e.g. chat): only clear fixed BottomNav + small gap — no scroll buffer,
 * so the chat shell sits closer to the bottom nav.
 */
export const AUTH_MAIN_PADDING_BOTTOM_COMPACT_PX = BOTTOM_NAV_HEIGHT + 8;

/** Fixed UI on compact routes — sit above bottom nav + safe area */
export const ABOVE_BOTTOM_NAV_COMPACT_PX = AUTH_MAIN_PADDING_BOTTOM_COMPACT_PX;

/** Total vertical inset (using larger header for worst-case estimates) */
export const AUTH_MAIN_VERTICAL_INSET_PX =
  AUTH_MAIN_PADDING_TOP_PX + AUTH_MAIN_PADDING_BOTTOM_PX;

/** For fixed overlays (e.g. upload toast) — sit above bottom nav + safe area */
export const ABOVE_BOTTOM_NAV_OFFSET_PX = AUTH_MAIN_PADDING_BOTTOM_PX;
