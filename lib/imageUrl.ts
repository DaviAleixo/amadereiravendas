const SUPABASE_STORAGE_BASE = 'https://mbpkdmswzhyibmrlhadi.supabase.co/storage/v1/object/public/products';

export function resolveProductImageUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // If already an absolute HTTP/HTTPS URL, return it
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // If it's a layout asset (logo, wpp, background), keep local path
  if (
    trimmed.includes('logo') ||
    trimmed.includes('wpp') ||
    trimmed.includes('background')
  ) {
    return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  }

  // Remove leading slash and sanitize spaces
  const cleanName = trimmed.replace(/^\//, '').replace(/\s+/g, '_');
  return `${SUPABASE_STORAGE_BASE}/${cleanName}`;
}
