// Register-only subdomain. When the app is served from this host we lock the
// SPA to the /register page and render logo-only chrome (no site navigation).
// Set VITE_REGISTER_HOST at build/dev time to preview on another host (e.g. localhost).
const REGISTER_ONLY_HOST =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_REGISTER_HOST) ||
  'register.void-society.in';

export const isRegisterOnlyHost = () => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === REGISTER_ONLY_HOST;
};

export default REGISTER_ONLY_HOST;
