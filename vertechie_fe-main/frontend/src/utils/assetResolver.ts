/**
 * Utility to resolve asset paths correctly in both development and production environments.
 * Uses Vite's BASE_URL so assets work when the app is deployed at root (/) or a subpath (e.g. /web-app/).
 */
export const resolveAssetPath = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '') || '';
  return `${base}/${normalizedPath}`;
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