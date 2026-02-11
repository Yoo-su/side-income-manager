import axios from "axios";

// Move base URL to environment setup or shared constant
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors here if needed
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors (e.g. 401 Unauthorized)
    return Promise.reject(error);
  },
);
