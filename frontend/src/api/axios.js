import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Centralized Axios client with JWT handling.
 *
 * - In dev, Vite proxies /api → backend, so we can use a relative baseURL.
 * - In prod (Vercel), set VITE_API_URL to your Render backend URL.
 */
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://nexra-backend.onrender.com' : '');

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// ===== Request: attach JWT from localStorage =====
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexra_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== Response: unwrap errors, auto-logout on 401 =====
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      'Unexpected error occurred.';

    // 401 → clear session & redirect (unless we're already on an auth page)
    if (status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('nexra_token');
      localStorage.removeItem('nexra_user');
      // Avoid looping — only redirect if it looks like a session-expired case
      if (error.config?.url && !error.config.url.includes('/auth/')) {
        toast.error('Session expired. Please sign in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 800);
      }
    }

    // Network errors
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default api;
