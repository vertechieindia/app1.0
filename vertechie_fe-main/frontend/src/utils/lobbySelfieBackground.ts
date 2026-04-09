/**
 * Lobby virtual background using MediaPipe Image Segmenter (selfie landscape).
 * Composites only the person over a custom image or blurred-room background.
 */

import { FilesetResolver, ImageSegmenter } from '@mediapipe/tasks-vision';

const WASM_CDN =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm';
const SELFIE_LANDSCAPE =
  'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter_landscape/float16/latest/selfie_segmenter_landscape.tflite';

let blurScratch: HTMLCanvasElement | null = null;
let personScratch: HTMLCanvasElement | null = null;
let maskScratch: HTMLCanvasElement | null = null;

function ensureScratch(w: number, h: number) {
  if (!blurScratch) blurScratch = document.createElement('canvas');
  if (!personScratch) personScratch = document.createElement('canvas');
  if (!maskScratch) maskScratch = document.createElement('canvas');
  if (blurScratch.width !== w || blurScratch.height !== h) {
    blurScratch.width = w;
    blurScratch.height = h;
    personScratch.width = w;
    personScratch.height = h;
    maskScratch.width = w;
    maskScratch.height = h;
  }
  return { blurScratch, personScratch, maskScratch };
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih) return;
  const ir = iw / ih;
  const cr = cw / ch;
  let dw = cw;
  let dh = ch;
  let dx = 0;
  let dy = 0;
  if (ir > cr) {
    dh = ch;
    dw = ch * ir;
    dx = (cw - dw) / 2;
  } else {
    dw = cw;
    dh = cw / ir;
    dy = (ch - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

export async function createLobbyImageSegmenter(): Promise<ImageSegmenter> {
  const vision = await FilesetResolver.forVisionTasks(WASM_CDN);
  const base = {
    modelAssetPath: SELFIE_LANDSCAPE,
  };
  const opts = {
    baseOptions: { ...base, delegate: 'GPU' as const },
    runningMode: 'VIDEO' as const,
    outputCategoryMask: true,
    outputConfidenceMasks: false,
  };
  try {
    return await ImageSegmenter.createFromOptions(vision, opts);
  } catch {
    return ImageSegmenter.createFromOptions(vision, {
      baseOptions: base,
      runningMode: 'VIDEO',
      outputCategoryMask: true,
      outputConfidenceMasks: false,
    });
  }
}

export type LobbyVbgPaintMode = 'image' | 'blur';

const personIndexBySegmenter = new WeakMap<ImageSegmenter, number>();

/** Map raw mask byte to class index (selfie model is binary: 0 vs 1, some runtimes use 0 vs 255). */
function maskByteToClassIndex(raw: number): number {
  if (raw === 0 || raw === 1) return raw;
  return raw >= 128 ? 1 : 0;
}

/**
 * Border pixels are usually background; whichever class dominates the frame border is treated as
 * background so we can derive the person class when label metadata is missing.
 */
function inferPersonIndexFromMask(
  mdata: Uint8Array,
  mw: number,
  mh: number,
): number {
  let c0 = 0;
  let c1 = 0;
  const bump = (i: number) => {
    const v = maskByteToClassIndex(mdata[i]);
    if (v === 0) c0++;
    else c1++;
  };
  for (let x = 0; x < mw; x++) {
    bump(x);
    bump((mh - 1) * mw + x);
  }
  for (let y = 0; y < mh; y++) {
    bump(y * mw);
    bump(y * mw + (mw - 1));
  }
  const bgClass = c0 >= c1 ? 0 : 1;
  return bgClass === 0 ? 1 : 0;
}

function resolvePersonClassIndex(
  segmenter: ImageSegmenter,
  mdata: Uint8Array,
  mw: number,
  mh: number,
): number {
  let idx = personIndexBySegmenter.get(segmenter);
  if (idx !== undefined) return idx;

  const labels = segmenter.getLabels();
  const named = labels.findIndex((l) =>
    /person|human|portrait|foreground/i.test(String(l).toLowerCase()),
  );
  if (named >= 0) idx = named;
  else if (labels.length >= 2) idx = 1;
  else idx = inferPersonIndexFromMask(mdata, mw, mh);

  personIndexBySegmenter.set(segmenter, idx);
  return idx;
}

export function paintLobbyVirtualBackground(params: {
  segmenter: ImageSegmenter;
  video: HTMLVideoElement;
  out: HTMLCanvasElement;
  mode: LobbyVbgPaintMode;
  bgImage: HTMLImageElement | null;
  timestamp: number;
}): void {
  const { segmenter, video, out, mode, bgImage, timestamp } = params;
  if (video.readyState < 2 || !video.videoWidth) return;

  const vw = video.videoWidth;
  const vh = video.videoHeight;
  const maxW = 960;
  const scale = vw > maxW ? maxW / vw : 1;
  const w = Math.max(1, Math.round(vw * scale));
  const h = Math.max(1, Math.round(vh * scale));

  if (out.width !== w || out.height !== h) {
    out.width = w;
    out.height = h;
  }

  const octx = out.getContext('2d');
  if (!octx) return;

  const result = segmenter.segmentForVideo(video, timestamp);
  const cat = result.categoryMask;
  if (!cat) {
    result.close();
    octx.fillStyle = '#3c4043';
    octx.fillRect(0, 0, w, h);
    octx.drawImage(video, 0, 0, w, h);
    return;
  }

  const mw = cat.width;
  const mh = cat.height;
  const raw = cat.getAsUint8Array();
  const mdata = new Uint8Array(raw);
  result.close();

  const { blurScratch: blurC, personScratch: personC, maskScratch: maskC } =
    ensureScratch(w, h);
  const bctx = blurC.getContext('2d');
  const pctx = personC.getContext('2d');
  const mkctx = maskC.getContext('2d');
  if (!bctx || !pctx || !mkctx) return;

  octx.setTransform(1, 0, 0, 1, 0, 0);
  octx.clearRect(0, 0, w, h);

  if (mode === 'image' && bgImage?.complete && (bgImage.naturalWidth || bgImage.width)) {
    drawCover(octx, bgImage, w, h);
  } else if (mode === 'blur') {
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.clearRect(0, 0, w, h);
    bctx.filter = 'blur(14px)';
    bctx.drawImage(video, 0, 0, w, h);
    bctx.filter = 'none';
    octx.drawImage(blurC, 0, 0);
  } else {
    octx.fillStyle = '#3c4043';
    octx.fillRect(0, 0, w, h);
  }

  const personIdx = resolvePersonClassIndex(segmenter, mdata, mw, mh);

  const imgData = mkctx.createImageData(w, h);
  const d = imgData.data;
  for (let y = 0; y < h; y++) {
    const yf = (y + 0.5) / h;
    for (let x = 0; x < w; x++) {
      const xf = (x + 0.5) / w;
      const mx = Math.min(mw - 1, Math.floor(xf * mw));
      const my = Math.min(mh - 1, Math.floor(yf * mh));
      const raw = mdata[my * mw + mx];
      const classIdx = maskByteToClassIndex(raw);
      const isPerson = classIdx === personIdx;
      const di = (y * w + x) * 4;
      d[di] = 255;
      d[di + 1] = 255;
      d[di + 2] = 255;
      d[di + 3] = isPerson ? 255 : 0;
    }
  }
  mkctx.putImageData(imgData, 0, 0);

  pctx.setTransform(1, 0, 0, 1, 0, 0);
  pctx.clearRect(0, 0, w, h);
  pctx.drawImage(video, 0, 0, w, h);
  pctx.globalCompositeOperation = 'destination-in';
  pctx.drawImage(maskC, 0, 0);
  pctx.globalCompositeOperation = 'source-over';

  octx.drawImage(personC, 0, 0);
}
