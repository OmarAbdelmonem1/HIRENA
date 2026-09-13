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
export default api;