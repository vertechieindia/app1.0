/**
 * Image Quality Validation and Enhancement Utilities
 * Ensures captured document images meet OCR requirements
 */

export interface ImageQualityResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  width: number;
  height: number;
  fileSize: number; // in bytes
  estimatedDPI: number;
  blurScore: number; // 0-1, higher is better
}

/**
 * Minimum requirements for document images
 */
const MIN_RESOLUTION = { width: 1024, height: 768 };
const RECOMMENDED_RESOLUTION = { width: 1600, height: 1200 };
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4 MB
const MIN_DPI = 200; // Minimum DPI for OCR
const RECOMMENDED_DPI = 300; // Recommended DPI
const MIN_BLUR_SCORE = 0.3; // Minimum blur score (0-1)

/**
 * Calculate estimated DPI from image dimensions
 */
export function estimateDPI(width: number, height: number, documentType: 'id' | 'document' = 'id'): number {
  const documentDimensions = documentType === 'id' 
    ? { width: 3.375, height: 2.125 } // ID card
    : { width: 8.27, height: 11.69 }; // A4 document
  
  const dpiWidth = width / documentDimensions.width;
  const dpiHeight = height / documentDimensions.height;
  
  return Math.min(dpiWidth, dpiHeight);
}

/**
 * Detect blur in an image using Laplacian variance
 */
export function detectBlur(imageData: ImageData): number {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  
  let variance = 0;
  let mean = 0;
  const laplacian: number[] = [];
  const step = 4;
  
  for (let y = 1; y < height - 1; y += step) {
    for (let x = 1; x < width - 1; x += step) {
      const idx = (y * width + x) * 4;
      
      const center = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      const right = (data[idx + 4] + data[idx + 5] + data[idx + 6]) / 3;
      const left = (data[idx - 4] + data[idx - 3] + data[idx - 2]) / 3;
      const bottom = (data[(y + 1) * width * 4 + x * 4] + 
                      data[(y + 1) * width * 4 + x * 4 + 1] + 
                      data[(y + 1) * width * 4 + x * 4 + 2]) / 3;
      const top = (data[(y - 1) * width * 4 + x * 4] + 
                   data[(y - 1) * width * 4 + x * 4 + 1] + 
                   data[(y - 1) * width * 4 + x * 4 + 2]) / 3;
      
      const laplacianValue = Math.abs(center * 4 - (top + bottom + left + right));
      laplacian.push(laplacianValue);
      mean += laplacianValue;
    }
  }
  
  mean /= laplacian.length;
  
  for (const val of laplacian) {
    variance += Math.pow(val - mean, 2);
  }
  variance /= laplacian.length;
  
  const normalizedScore = Math.min(1, Math.max(0, (variance - 10) / 90));
  
  return normalizedScore;
}

/**
 * Validate image quality for OCR/document processing
 */
export async function validateImageQuality(
  dataUrl: string,
  documentType: 'id' | 'document' = 'id'
): Promise<ImageQualityResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        
        const base64Data = dataUrl.split(',')[1] || dataUrl;
        const fileSize = (base64Data.length * 3) / 4;
        
        const estimatedDPI = estimateDPI(width, height, documentType);
        
        // Check resolution
        if (width < MIN_RESOLUTION.width || height < MIN_RESOLUTION.height) {
          errors.push(
            `Resolution too low: ${width}x${height}. Minimum required: ${MIN_RESOLUTION.width}x${MIN_RESOLUTION.height}`
          );
        } else if (width < RECOMMENDED_RESOLUTION.width || height < RECOMMENDED_RESOLUTION.height) {
          warnings.push(
            `Resolution below recommended: ${width}x${height}. Recommended: ${RECOMMENDED_RESOLUTION.width}x${RECOMMENDED_RESOLUTION.height}`
          );
        }
        
        // Check DPI
        if (estimatedDPI < MIN_DPI) {
          errors.push(
            `Estimated DPI too low: ${estimatedDPI.toFixed(0)}. Minimum required: ${MIN_DPI} DPI`
          );
        } else if (estimatedDPI < RECOMMENDED_DPI) {
          warnings.push(
            `Estimated DPI below recommended: ${estimatedDPI.toFixed(0)}. Recommended: ${RECOMMENDED_DPI} DPI`
          );
        }
        
        // Check file size
        if (fileSize > MAX_FILE_SIZE) {
          errors.push(
            `File size too large: ${(fileSize / 1024 / 1024).toFixed(2)} MB. Maximum: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(2)} MB`
          );
        }
        
        // Check aspect ratio
        const aspectRatio = width / height;
        if (aspectRatio < 0.5 || aspectRatio > 2.5) {
          warnings.push(
            `Unusual aspect ratio: ${aspectRatio.toFixed(2)}. Document may be rotated or cropped incorrectly.`
          );
        }
        
        // Detect blur
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);
        const blurScore = detectBlur(imageData);
        
        if (blurScore < MIN_BLUR_SCORE) {
          errors.push(
            `Image is too blurry (blur score: ${blurScore.toFixed(2)}). Please ensure the document is in focus and well-lit.`
          );
        } else if (blurScore < 0.5) {
          warnings.push(
            `Image may be slightly blurry (blur score: ${blurScore.toFixed(2)}). For best results, ensure the document is in sharp focus.`
          );
        }
        
        const result: ImageQualityResult = {
          isValid: errors.length === 0,
          errors,
          warnings,
          width,
          height,
          fileSize,
          estimatedDPI,
          blurScore
        };
        
        resolve(result);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for validation'));
      };
      
      img.src = dataUrl;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Enhance image quality for better OCR results
 * Updated: Preserves color information instead of converting to grayscale
 * This is critical for Aadhaar cards and other documents with colored text
 */
export async function enhanceImageForOCR(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply contrast and brightness enhancement while preserving color
        const contrast = 1.3; // Increased contrast for better text clarity
        const brightness = 1.05; // Slight brightness boost
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
        
        for (let i = 0; i < data.length; i += 4) {
          // Enhance each color channel separately (preserve color information)
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Apply contrast enhancement to each RGB channel
          const newR = Math.max(0, Math.min(255, factor * (r - 128) + 128));
          const newG = Math.max(0, Math.min(255, factor * (g - 128) + 128));
          const newB = Math.max(0, Math.min(255, factor * (b - 128) + 128));
          
          // Apply brightness adjustment
          data[i] = Math.max(0, Math.min(255, newR * brightness));
          data[i + 1] = Math.max(0, Math.min(255, newG * brightness));
          data[i + 2] = Math.max(0, Math.min(255, newB * brightness));
          // Alpha channel (data[i + 3]) remains unchanged
        }
        
        ctx.putImageData(imageData, 0, 0);
        
        // Use higher quality (0.98) for better OCR results
        const enhancedDataUrl = canvas.toDataURL('image/jpeg', 0.98);
        resolve(enhancedDataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for enhancement'));
      };
      
      img.src = dataUrl;
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Compress image while maintaining quality for OCR
 */
export async function compressForOCR(
  dataUrl: string,
  maxFileSize: number = MAX_FILE_SIZE,
  quality: number = 0.9
): Promise<string> {
  const base64Data = dataUrl.split(',')[1] || dataUrl;
  const currentSize = (base64Data.length * 3) / 4;
  
  if (currentSize <= maxFileSize) {
    return dataUrl;
  }
  
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      
      img.onload = () => {
        let currentQuality = quality;
        let attempts = 0;
        const maxAttempts = 10;
        
        const tryCompress = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0);
          const compressed = canvas.toDataURL('image/jpeg', currentQuality);
          
          const compressedBase64 = compressed.split(',')[1] || compressed;
          const compressedSize = (compressedBase64.length * 3) / 4;
          
          if (compressedSize <= maxFileSize || attempts >= maxAttempts) {
            resolve(compressed);
          } else {
            currentQuality -= 0.1;
            attempts++;
            tryCompress();
          }
        };
        
        tryCompress();
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'));
      };
      
      img.src = dataUrl;
    } catch (error) {
      reject(error);
    }
  });
}

