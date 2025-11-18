"use client";
import { useState } from "react";
import { FaListCheck } from "react-icons/fa6";
import RegisterSection from "./components/RegisterSection";
import LoginSection from "./components/LoginSection";

export default function Auth() {
  const [mode, setMode] = useState<"register" | "login">("register");
  return (
    <div className="bg-[#0D0D0D] text-[#EAEAEA] p-5 h-screen">
      <header className="text-2xl font-bold">Daily Productivity</header>

      <main className="flex mt-50 ">
        {mode === "register" ? (
          <RegisterSection onSwitch={() => setMode("login")} />
        ) : (
          <LoginSection onSwitch={() => setMode("register")} />
        )}
      </main>

      <footer className="absolute bottom-5 right-5">
        <FaListCheck className="text-5xl" />
      </footer>
    </div>
  );
}
