// src/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_SERVER,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// Optional: Add interceptors to log requests/errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("❌ Axios error:", error);
    return Promise.reject(error);
  }
);

export default axiosClient;
