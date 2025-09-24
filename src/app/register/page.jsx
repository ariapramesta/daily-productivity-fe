"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { register } from "@/lib/authApi";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useAuthStore();
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== repassword) {
      alert("Password dan Retype Password tidak sama");
      return;
    }

    setLoading(true);
    try {
      // Backend harus return user + set cookie access/refresh token
      const res = await register(email, name, password);

      // Simpan user ke zustand -> auto login
      setUser(res.data.user);

      // Langsung arahkan ke dashboard/home
      router.push("/");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-lg p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-white">Register</h1>

        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm text-zinc-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg px-4 py-2 bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm text-zinc-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg px-4 py-2 bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter your name"
            required
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
            className="rounded-lg px-4 py-2 bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="repassword" className="text-sm text-zinc-300 mb-1">
            Retype Password
          </label>
          <input
            type="password"
            id="repassword"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
            className="rounded-lg px-4 py-2 bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Retype your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-zinc-700 to-zinc-900 text-white font-semibold py-2 rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <a href="/login" className="text-gray-300 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
