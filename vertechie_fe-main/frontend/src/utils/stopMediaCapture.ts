/**
 * Stop every MediaStream attached to <video>/<audio> in this document and clear srcObject.
 * Use after leaving webcam flows (e.g. job apply → coding test) or when an assessment ends,
 * so the browser camera/mic indicator turns off even if a component leaked a stream ref.
 */
export function stopAllDocumentMediaStreams(): void {
  if (typeof document === 'undefined') return;
  try {
    document.querySelectorAll('video, audio').forEach((el) => {
      const stream = el.srcObject;
      if (stream && typeof (stream as MediaStream).getTracks === 'function') {
        (stream as MediaStream).getTracks().forEach((t) => {
          try {
            t.stop();
          } catch {
            /* ignore */
          }
        });
      }
      el.srcObject = null;
    });
  } catch {
    /* ignore */
  }
}
