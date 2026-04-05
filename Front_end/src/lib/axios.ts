// src/lib/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8888", // default
});

// ✅ Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ Optional fallback (8888 → 8000)
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.code === "ERR_NETWORK") {
      const newRequest = error.config;
      newRequest.baseURL = "http://localhost:8000";
      return axios(newRequest);
    }
    return Promise.reject(error);
  },
);