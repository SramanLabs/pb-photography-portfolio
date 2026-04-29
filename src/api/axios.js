import axios from 'axios';

// Strip trailing slash to prevent double-slash URLs (e.g. https://api.com//api/albums)
const rawApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const BASE_URL = rawApiUrl;

const api = axios.create({
  baseURL: rawApiUrl ? `${rawApiUrl}/api` : '/api',
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
