"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        api.get("/auth/me")
            .then((res) => {
                setUser(res.data.user);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                router.push("/login");
            });
    }, [router]);

    if (loading) return <p>Loading...</p>;

    return <>{children}</>;
}
