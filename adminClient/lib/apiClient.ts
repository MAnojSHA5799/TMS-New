import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://tms-new-ahsi.onrender.com/api",

  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token && config && config.headers)
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
