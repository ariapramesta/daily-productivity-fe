"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function LoginSection({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await login(email, password);
      console.log("Success: ", res);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <section>
      <h1 className="text-7xl font-semibold mb-5">Welcome Back!</h1>
      <p className="mb-10">
        Doesn't have have account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="cursor-pointer text-blue-600"
        >
          Register
        </button>
      </p>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div>
          <label htmlFor="email">Email</label>
          <div className="border border-[#2F2F2F] flex items-center gap-2 p-2 rounded focus-within:border-[#4F4F4F]">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="youremail@example.com"
              className="outline-none w-full bg-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MdEmail className="text-lg" />
          </div>
        </div>

        <div>
          <label htmlFor="pw">Password</label>
          <div className="border border-[#2F2F2F] flex items-center gap-2 p-2 rounded focus-within:border-[#4F4F4F]">
            <input
              type="password"
              name="password"
              id="pw"
              placeholder="Password"
              className="outline-none w-full bg-transparent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaEye className="text-lg" />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#1A1A1A] p-3 rounded hover:outline hover:outline-white cursor-pointer"
        >
          Login
        </button>
      </form>
    </section>
  );
}
