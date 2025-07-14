// Centralized API base URL for all requests and image URLs
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper to prefix API URLs
export function apiUrl(path) {
  if (!path) return API_BASE_URL;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : "/" + path}`;
}
