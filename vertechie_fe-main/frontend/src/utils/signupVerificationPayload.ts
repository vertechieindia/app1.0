/** Shared helpers for /register face + document verification payloads */

/**
 * Liveness flow stores multiple frames as JSON.stringify(frames) on `livePhoto`.
 * Register must send `face_verification` as string[] of data URLs (one per captured position).
 */
export function normalizeFaceVerificationPayload(livePhoto: unknown): string[] | null {
  if (livePhoto == null) return null;

  if (Array.isArray(livePhoto)) {
    const list = livePhoto.filter((x) => typeof x === 'string' && x.trim()) as string[];
    if (list.length === 1) {
      const unwrapped = tryParseFramesJsonString(list[0]);
      if (unwrapped) return unwrapped;
    }
    return list.length ? list : null;
  }

  if (typeof livePhoto === 'string') {
    const s = livePhoto.trim();
    if (!s || s.toLowerCase() === 'null') return null;

    if (s.startsWith('[')) {
      const parsed = tryParseFramesJsonString(s);
      if (parsed) return parsed;
    }

    if (s.startsWith('data:image') || s.length > 400) {
      return [s];
    }
  }

  return null;
}

function tryParseFramesJsonString(s: string): string[] | null {
  try {
    const parsed = JSON.parse(s) as unknown;
    if (!Array.isArray(parsed)) return null;
    const urls = parsed.filter((x) => typeof x === 'string' && x.trim()) as string[];
    return urls.length ? urls : null;
  } catch {
    return null;
  }
}

function isLikelyImageData(s: unknown): s is string {
  if (typeof s !== 'string' || !s.trim()) return false;
  return s.startsWith('data:image') || s.length > 400;
}

export function buildDocumentVerificationPayload(formData: Record<string, unknown>): Record<string, string> | null {
  const entries: [string, unknown][] = [
    ['pan_card', formData.panCard],
    ['aadhaar', formData.aadhaar],
    ['government_id', formData.governmentId],
    ['ssn_document', formData.ssn],
    ['nino_document', formData.nino],
    ['sin_document', formData.sin],
    ['social_insurance_de', formData.sozialversicherungsnummer],
    ['ahv_document', formData.ahvNumber],
    ['resident_id', formData.residentIdCard],
    ['passport', formData.passport],
  ];
  const out: Record<string, string> = {};
  for (const [k, v] of entries) {
    if (isLikelyImageData(v)) out[k] = v;
  }
  return Object.keys(out).length ? out : null;
}
