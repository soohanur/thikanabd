// Auto-detect API base URL for local and production
function getApiBaseUrl() {
  // If env variable is set, use it
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  // If running on localhost, use local backend
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:5000';
  }
  // Otherwise, use production backend
  return 'https://thikanabd-backend.onrender.com';
}

export const API_BASE_URL = getApiBaseUrl();

// Helper to prefix API URLs
export function apiUrl(path) {
  if (!path) return API_BASE_URL;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;
}

// Preference: Use navigate for all link additions (client-side navigation)
// (Set by user on 2025-07-16)
