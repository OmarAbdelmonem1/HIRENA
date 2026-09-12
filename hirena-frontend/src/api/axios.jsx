import axios from "axios";
import { baseUrl } from "../config";

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const tokenType = localStorage.getItem("tokenType") || "Bearer";

  console.log("TOKEN =", token);
  console.log("TOKEN TYPE =", tokenType);

  if (token) {
    config.headers.Authorization = `${tokenType} ${token}`;
  }

  console.log("AUTH HEADER =", config.headers.Authorization);

  return config;
});
export default api;