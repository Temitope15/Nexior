// Rewrites Suno-hosted media URLs through our same-origin proxy so the browser
// can load them without hitting Suno's CORS. Producer URLs don't need this.
export function proxyMediaUrl(url: string | undefined | null): string {
  if (!url) return '';
  return url
    .replace(/^https?:\/\/audiopipe\.suno\.ai/i, '/suno-media')
    .replace(/^https?:\/\/cdn1\.suno\.ai/i, '/suno-cdn1')
    .replace(/^https?:\/\/cdn2\.suno\.ai/i, '/suno-cdn2');
}
