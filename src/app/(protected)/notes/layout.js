"use client";
import { useState } from "react";
import Sidebar from "@/components/SideBar";
import { NotesProvider } from "@/context/NotesContext";

export default function NotesLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <NotesProvider>
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 flex overflow-hidden">{children}</main>
      </div>
    </NotesProvider>
  );
}
