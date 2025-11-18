import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
});

// Request Interceptor

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (refresh token)

let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch(Promise.reject);
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post("/auth/refresh");

        useAuthStore.getState().setAccessToken(data.accessToken);

        processQueue(null, data.accessToken);
        isRefreshing = false;

        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (error) {
        processQueue(error, null);
        isRefreshing = false;

        useAuthStore.getState().logout();

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
