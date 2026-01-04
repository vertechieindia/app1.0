/**
 * Utility to resolve asset paths correctly in both development and production environments
 * This is needed because in production the app is served from /web-app/ but in development it's served from /
 */
export const resolveAssetPath = (path: string): string => {
  // Remove leading slash if present
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  
  // In development, we serve assets from the root
  if (import.meta.env.DEV) {
    return `/${normalizedPath}`;
  }
  
  // In production, assets are served from the root
  // Cloudflare Pages serves from the root path
  return `/${normalizedPath}`;
};

/**
 * Utility to resolve image paths correctly
 */
export const resolveImagePath = (imagePath: string): string => {
  // Remove any leading /images/ from the path
  const cleanPath = imagePath.replace(/^\/?images\//, '');
  return resolveAssetPath(`images/${cleanPath}`);
};

export default resolveAssetPath; 