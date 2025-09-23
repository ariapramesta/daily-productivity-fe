import api from "./axios"; // kalau file axios.js kamu taruh di sini

// Login
export async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    return res.data;
}

// Logout
export async function logoutApi() {
    const res = await api.post("/auth/logout");
    return res.data;
}

// Cek session user
export async function fetchMe() {
    const res = await api.get("/auth/me");
    return res.data;
}
