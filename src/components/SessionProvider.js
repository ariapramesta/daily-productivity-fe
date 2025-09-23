"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchMe } from "@/lib/authApi";

export default function SessionProvider({ children }) {
    const { setUser } = useAuthStore();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await fetchMe();
                setUser(res.user);
            } catch (err) {
                console.error("Not logged in");
            }
        };
        loadUser();
    }, [setUser]);

    return children;
}
