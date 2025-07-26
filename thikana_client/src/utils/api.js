// Auto-detect API base URL for local and production
function getApiBaseUrl() {
  // If env variable is set, use it
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  // If running on localhost, use local backend
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'https://thikanabd-backend.onrender.com';
  }
  // Otherwise, use production backend
  return 'https://thikanabd-backend.onrender.com';
}


export const API_BASE_URL = "https://thikanabd-backend.onrender.com";

// Helper to prefix API URLs
export function apiUrl(path) {
  if (!path) return API_BASE_URL;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
}
