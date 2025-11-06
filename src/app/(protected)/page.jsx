"use client";
import { useState } from "react";
import Sidebar from "@/components/SideBar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 transition-all duration-300">
        <h1>Main Content</h1>
        <p>Konten utama sekarang otomatis menyesuaikan sidebar.</p>
      </main>
    </div>
  );
}
