import axios from 'axios';

let refreshInFlight: Promise<void> | null = null;

// Create an Axios instance pointing to the NestJS backend
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for attaching tokens, error handling, etc.
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Read accessToken from cookies
    const match = document.cookie.match(new RegExp('(^| )accessToken=([^;]+)'));
    if (match) {
      config.headers.Authorization = `Bearer ${match[2]}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const requestUrl = String(originalRequest?.url || '');
    const isAuthRequest = /\/auth\/(login|register|refresh|logout|google)/.test(requestUrl);

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;
      refreshInFlight ??= api.post('/api/v1/auth/refresh', {})
        .then(() => undefined)
        .finally(() => { refreshInFlight = null; });

      return refreshInFlight
        .then(() => api(originalRequest))
        .catch(async () => {
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
            // Session is unrecoverable: clear the httpOnly cookies before leaving.
            await api.post('/api/v1/auth/logout').catch(() => undefined);
            window.location.assign('/login');
          }
          return Promise.reject(error);
        });
    }

    // Global error handler
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
