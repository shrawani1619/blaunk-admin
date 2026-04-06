/**
 * Backend API base URL. Set in .env as VITE_API_BASE_URL (e.g. http://localhost:8000).
 */
export const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string) || 'http://localhost:8000';
