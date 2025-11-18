"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaUser } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function RegisterSection({
  onSwitch,
}: {
  onSwitch: () => void;
}) {
  const router = useRouter();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await register({ email, name, password });
      console.log("Success: ", res);
      router.push("/dashboard");
    } catch (error) {
      console.error("Register Failed: ", error);
    }
  }

  return (
    <section>
      <h1 className="text-7xl font-semibold mb-5">Create new account</h1>
      <p className="mb-10">
        Already have account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="cursor-pointer text-blue-600"
        >
          Login
        </button>
      </p>
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label htmlFor="name">Name</label>
            <div className="border border-[#2F2F2F] flex items-center gap-2 p-2 rounded focus-within:border-[#4F4F4F]">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Your Name"
                className="outline-none w-full bg-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FaUser className="text-md" />
            </div>
          </div>
        </div>

        {/* PASSWORD */}
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

        {/* RETYPE PASSWORD */}
        <div>
          <label htmlFor="repw">Retype Password</label>
          <div className="border border-[#2F2F2F] flex items-center gap-2 p-2 rounded focus-within:border-[#4F4F4F]">
            <input
              type="password"
              name="repassword"
              id="repw"
              placeholder="Retype Password"
              className="outline-none w-full bg-transparent"
            />
            <FaEye className="text-lg" />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#1A1A1A] p-3 rounded hover:outline hover:outline-white cursor-pointer"
        >
          Register
        </button>
      </form>
    </section>
  );
}
