"use client";
import { useState } from "react";
import Sidebar from "@/components/SideBar";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 p-6 transition-all duration-300">
        <h1 className="font-bold">Notes Pages</h1>
      </main>
    </div>
  );
}
