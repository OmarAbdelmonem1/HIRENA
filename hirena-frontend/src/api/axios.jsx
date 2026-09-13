import axios from "axios";
import { baseUrl } from "../config";

const api = axios.create({
  baseURL: baseUrl.replace(/\/+$/, ""),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";

  if (token) {
    config.headers.Authorization = `${tokenType} ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || "";
    if (
      error.response?.status === 401 &&
      !requestUrl.startsWith("/api/auth/")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenType");
      localStorage.removeItem("auth_user");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
