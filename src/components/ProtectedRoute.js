"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMe } from "@/lib/authApi";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchMe()
            .then(() => setLoading(false))
            .catch(() => {
                setLoading(false);
                router.push("/login");
            });
    }, [router]);

    if (loading) return <p>Loading...</p>;

    return <>{children}</>;
}
