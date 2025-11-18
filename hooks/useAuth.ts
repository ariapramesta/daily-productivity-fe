"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { setAccessToken, setUser, logout } = useAuthStore();

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });

    setAccessToken(res.data.accessToken);
    setUser(res.data.user);

    return res.data;
  };

  const register = async (payload: {
    email: string;
    name: string;
    password: string;
  }) => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  };

  const doLogout = async () => {
    await api.post("/auth/logout");
    logout();
  };

  return {
    login,
    register,
    logout: doLogout,
  };
}
