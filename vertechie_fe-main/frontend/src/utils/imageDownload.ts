/**
 * Utility function to download an image from base64 data URL
 * @param dataUrl - Base64 data URL (e.g., "data:image/jpeg;base64,...")
 * @param filename - Name of the file to download (without extension)
 * @param fileType - Type of file (default: 'jpeg')
 */
export const downloadImage = (dataUrl: string, filename: string, fileType: string = 'jpeg'): void => {
  try {
    // Convert data URL to blob
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    const blob = new Blob([ab], { type: mimeString });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${fileType}`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Image downloaded: ${filename}.${fileType}`);
  } catch (error) {
    console.error('Error downloading image:', error);
  }
};

/**
 * Generate a filename with timestamp
 * @param prefix - Prefix for the filename (e.g., "gov-id", "pan-card")
 * @returns Formatted filename string
 */
export const generateImageFilename = (prefix: string): string => {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `${prefix}_${timestamp}`;
};

/**
 * Compress and resize an image to reduce file size
 * @param dataUrl - Base64 data URL (e.g., "data:image/jpeg;base64,...")
 * @param maxWidth - Maximum width in pixels (default: 640)
 * @param maxHeight - Maximum height in pixels (default: 480)
 * @param quality - JPEG quality 0-1 (default: 0.7)
 * @returns Compressed base64 data URL
 */
export const compressImage = async (
  dataUrl: string,
  maxWidth: number = 640,
  maxHeight: number = 480,
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = Math.min(width, maxWidth);
            height = width / aspectRatio;
          } else {
            height = Math.min(height, maxHeight);
            width = height * aspectRatio;
          }
        }

        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = dataUrl;
    } catch (error) {
      reject(error);
    }
  });
};

