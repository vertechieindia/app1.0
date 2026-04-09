/**
 * Stop every MediaStream attached to <video>/<audio> in this document and clear srcObject.
 * Use after leaving webcam flows (e.g. job apply → coding test) or when an assessment ends,
 * so the browser camera/mic indicator turns off even if a component leaked a stream ref.
 */
export function stopAllDocumentMediaStreams(): void {
  if (typeof document === 'undefined') return;
  try {
    document.querySelectorAll('video, audio').forEach((node) => {
      const el = node as HTMLMediaElement;
      const stream = el.srcObject;
      // ... rest unchanged, using `el` instead of `el` from forEach directly
      el.srcObject = null;
    });
  } catch {
    /* ignore */
  }
}
