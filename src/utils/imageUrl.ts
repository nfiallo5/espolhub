const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://espolhub.onrender.com';

/**
 * Transforms a relative image path from the API to a full URL
 * @param relativePath - The relative path returned by the API (e.g., "/rails/active_storage/...")
 * @returns The full URL with base domain prepended
 */
export function getFullImageUrl(relativePath: string | null | undefined): string {
  if (!relativePath) {
    return '';
  }

  // If it's already a full URL, return as-is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }

  // Ensure the path starts with /
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  return `${API_BASE_URL}${path}`;
}

/**
 * Transform an array of relative image paths to full URLs
 */
export function getFullImageUrls(relativePaths: string[] | null | undefined): string[] {
  if (!relativePaths || relativePaths.length === 0) {
    return [];
  }

  return relativePaths.map(getFullImageUrl);
}
