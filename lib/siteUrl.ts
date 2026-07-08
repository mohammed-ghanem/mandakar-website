/**
 * Canonical public site origin (no trailing slash).
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://www.example.com).
 */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://mandakar.net"
  ).replace(/\/$/, "");
}
