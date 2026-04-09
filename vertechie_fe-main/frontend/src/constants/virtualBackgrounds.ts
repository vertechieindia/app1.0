/**
 * Shared virtual background presets (lobby + in-call). Keep ids in sync with sessionStorage.
 */

export type VbgPreset =
  | { id: 'none'; type: 'none'; label: string }
  | { id: 'blur'; type: 'blur'; label: string }
  | { id: string; type: 'image'; label: string; url: string };

export const VIRTUAL_BACKGROUNDS: VbgPreset[] = [
  { id: 'none', type: 'none', label: 'None' },
  { id: 'blur', type: 'blur', label: 'Blur' },
  {
    id: 'office1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    label: 'Modern Office',
  },
  {
    id: 'office2',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400',
    label: 'Bright Office',
  },
  {
    id: 'home',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    label: 'Home',
  },
  {
    id: 'nature',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=400',
    label: 'Nature',
  },
];

export const VBG_SESSION_ID_KEY = 'vt-lobby-virtual-background';
export const VBG_SESSION_CUSTOM_KEY = 'vt-lobby-vbg-custom';

/**
 * Module cache so React 18 Strict Mode (double mount) does not lose lobby → meet handoff:
 * the first mount's effect clears sessionStorage; the remount must still see the same VBG.
 * Call {@link resetLobbyVbgConsumptionCache} before each lobby `sessionStorage.setItem` so
 * a new join always reads fresh keys.
 */
let lobbyVbgConsumed: { id: string; custom: string | null } | null = null;

export function resetLobbyVbgConsumptionCache(): void {
  lobbyVbgConsumed = null;
}

export function consumeLobbyVbgForMeeting(): { id: string; custom: string | null } {
  if (lobbyVbgConsumed) {
    return lobbyVbgConsumed;
  }
  try {
    const idRaw = sessionStorage.getItem(VBG_SESSION_ID_KEY);
    const customRaw = sessionStorage.getItem(VBG_SESSION_CUSTOM_KEY);
    const id = idRaw != null && idRaw !== '' ? idRaw : 'none';
    const custom = customRaw != null && customRaw !== '' ? customRaw : null;
    lobbyVbgConsumed = { id, custom };
    sessionStorage.removeItem(VBG_SESSION_ID_KEY);
    sessionStorage.removeItem(VBG_SESSION_CUSTOM_KEY);
    return lobbyVbgConsumed;
  } catch {
    lobbyVbgConsumed = { id: 'none', custom: null };
    return lobbyVbgConsumed;
  }
}

/** Mic/camera state from lobby — applied in VideoRoom after getUserMedia (Strict Mode–safe cache). */
export const LOBBY_MEDIA_INTENT_KEY = 'vt-lobby-media-intent';

let lobbyMediaIntentConsumed: { muted: boolean; videoOff: boolean } | null = null;

export function resetLobbyMediaIntentCache(): void {
  lobbyMediaIntentConsumed = null;
}

export function consumeLobbyMediaIntent(): { muted: boolean; videoOff: boolean } | null {
  if (lobbyMediaIntentConsumed !== null) {
    return lobbyMediaIntentConsumed;
  }
  try {
    const raw = sessionStorage.getItem(LOBBY_MEDIA_INTENT_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as { muted?: boolean; videoOff?: boolean };
    sessionStorage.removeItem(LOBBY_MEDIA_INTENT_KEY);
    lobbyMediaIntentConsumed = {
      muted: Boolean(o.muted),
      videoOff: Boolean(o.videoOff),
    };
    return lobbyMediaIntentConsumed;
  } catch {
    return null;
  }
}

/** In-call ⋮ menu: cycles presets (custom is only from lobby upload). */
export const VBG_MORE_MENU_CYCLE_IDS = ['none', 'blur', 'office1', 'office2', 'home', 'nature'] as const;

export function resolveMeetingVbg(
  id: string,
  customDataUrl: string | null,
): { mode: 'none' | 'blur' | 'image'; imageUrl: string | null; label: string } {
  if (!id || id === 'none') {
    return { mode: 'none', imageUrl: null, label: 'None' };
  }
  if (id === 'blur') {
    return { mode: 'blur', imageUrl: null, label: 'Blur' };
  }
  if (id === 'custom' && customDataUrl) {
    return { mode: 'image', imageUrl: customDataUrl, label: 'Custom' };
  }
  const preset = VIRTUAL_BACKGROUNDS.find((b) => b.id === id && b.type === 'image');
  if (preset && preset.type === 'image') {
    return { mode: 'image', imageUrl: preset.url, label: preset.label };
  }
  return { mode: 'none', imageUrl: null, label: 'None' };
}
