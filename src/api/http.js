import axios from "axios";

/**
 * Shared axios instance.
 * baseURL already includes `/api` (see VITE_API_BASE_URL in .env).
 * The response interceptor unwraps `response.data` so callers get the payload
 * directly, and normalizes errors into a plain Error(message).
 */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default http;
