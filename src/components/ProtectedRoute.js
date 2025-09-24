"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchMe } from "@/lib/authApi";

export default function ProtectedRoute({ children }) {
    const { user, loading, setUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await fetchMe();
                setUser(res.user);
            } catch (err) {
                console.error("Session expired or not logged in:", err);
                setUser(null);
                router.push("/login");
            }
        };

        if (loading) checkSession();
    }, [loading, setUser, router]);

    if (loading) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
                <div className="w-12 h-12 border-4 border-zinc-600 border-t-white rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-zinc-400 animate-pulse">
                    Loading your session...
                </p>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}
