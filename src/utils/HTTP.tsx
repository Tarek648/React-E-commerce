import axios, { InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: "https://dummyjson.com",
});

export const setupAxiosInterceptor = () => {
  const requestInterceptor = api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return () => {
    api.interceptors.request.eject(requestInterceptor);
  };
};