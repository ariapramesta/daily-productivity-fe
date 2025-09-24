import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // kalau access token expired (401) dan belum pernah coba refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await api.post("/auth/refresh"); // ini akan set cookie accessToken baru
                return api(originalRequest);     // ulangi request yang gagal
            } catch (refreshError) {
                // kalau refresh gagal, redirect ke login
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);


export default api;