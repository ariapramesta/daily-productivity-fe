"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/authApi"; // pakai helper dari lib/api
import { useAuthStore } from "@/store/useAuthStore"; // zustand store

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // panggil helper login -> backend return { user, message }
      const data = await login(email, password);

      // simpan user ke zustand
      setUser(data.user);

      // redirect ke halaman utama
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
        <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center text-white">Login</h1>

          {error && <p className="text-center text-red-400">{error}</p>}

          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm text-zinc-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-lg px-4 py-2 bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm text-zinc-300 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg px-4 py-2 bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-zinc-700 to-zinc-900 text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-zinc-400">
            Don’t have an account?{" "}
            <a href="/register" className="text-gray-300 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </form>
  );
}
