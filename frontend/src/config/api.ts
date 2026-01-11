import axios from "axios";

// Create an axios instance
// Use localhost in development when the frontend is served from localhost
const defaultBase = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://localhost:3000'
  : 'https://arogyam-9rll.onrender.com';

const api = axios.create({
  baseURL: defaultBase
});

// Add an interceptor to add the Authorization header
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle the error
    return Promise.reject(error);
  }
);

export default api;
