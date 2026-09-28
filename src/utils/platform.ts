/**
 * Client-side platform helpers for UI hints (keyboard badges, touch affordances).
 * Safe to import from bundled page scripts — guards for SSR/undefined globals.
 */

/** True on Apple platforms (macOS, iOS, iPadOS). Uses UA-CH when available. */
export function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false;
  const uaData = (
    navigator as Navigator & { userAgentData?: { platform?: string } }
  ).userAgentData;
  // userAgentData.platform → "macOS" / "iOS"; fallbacks → "MacIntel", "iPhone",
  // "iPad", or the raw user agent. iPadOS 13+ reports "MacIntel" (matched by /mac/).
  // `navigator.platform` is deprecated by spec but is exactly the fallback we
  // want for older browsers — read it structurally to keep the hint quiet.
  const legacy = navigator as unknown as { platform?: string };
  const hint = uaData?.platform || legacy.platform || navigator.userAgent || '';
  return /mac|iphone|ipad/i.test(hint);
}

/** True for touch-only devices (no hoverable pointer) — key hints are meaningless there. */
export function isTouchOnly(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}
