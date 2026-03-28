/**
 * Authenticated shell spacing — keep in sync with AppHeader Toolbar + App.tsx <main>.
 * AppHeader Toolbar: minHeight xs 64px, md+ 70px (see AppHeader.tsx).
 */
export const HEADER_HEIGHT_XS = 64;
export const HEADER_HEIGHT_MD_UP = 70;
export const BOTTOM_NAV_HEIGHT = 80;

/** Gap between fixed chrome and scrollable content */
export const AUTH_MAIN_CHROME_GAP_PX = 16;

/** Padding inside <main> below fixed AppBar + gap (legacy single breakpoint — prefer responsive in App.tsx) */
export const AUTH_MAIN_PADDING_TOP_PX = HEADER_HEIGHT_MD_UP + AUTH_MAIN_CHROME_GAP_PX;

/** Padding inside <main> above fixed BottomNav + gap */
export const AUTH_MAIN_PADDING_BOTTOM_PX = BOTTOM_NAV_HEIGHT + AUTH_MAIN_CHROME_GAP_PX;

/** Total vertical inset (using larger header for worst-case estimates) */
export const AUTH_MAIN_VERTICAL_INSET_PX =
  AUTH_MAIN_PADDING_TOP_PX + AUTH_MAIN_PADDING_BOTTOM_PX;

/** For fixed overlays (e.g. upload toast) — sit above bottom nav + safe area */
export const ABOVE_BOTTOM_NAV_OFFSET_PX = AUTH_MAIN_PADDING_BOTTOM_PX;
