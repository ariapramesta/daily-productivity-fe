"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  StickyNote,
  ListTodo,
  Wallet,
  Folder,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";
import { useAuthStore } from "@/store/useAuthStore";

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();
  const { user } = useAuthStore();

  const menuGroups = [
    {
      title: "Main",
      items: [
        { name: "Dashboard", href: "/", icon: Home },
        { name: "Notes", href: "/notes", icon: StickyNote },
        { name: "Todos", href: "/todos", icon: ListTodo },
      ],
    },
    {
      title: "Finance",
      items: [{ name: "Expenses", href: "/expenses", icon: Wallet }],
    },
    {
      title: "Work",
      items: [{ name: "Projects", href: "/projects", icon: Folder }],
    },
  ];

  return (
    <motion.div
      initial={{ width: isOpen ? 256 : 64 }}
      animate={{ width: isOpen ? 256 : 64 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 bg-zinc-900 text-gray-200 flex flex-col border-r border-zinc-800 overflow-y-auto flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {isOpen && <h1 className="text-lg font-bold">Productivity</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded hover:bg-zinc-800"
        >
          {isOpen ? (
            <PanelLeftClose className="w-5 h-5" />
          ) : (
            <PanelLeftOpen className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu Groups */}
      <nav className="flex-1 mt-4 px-2 space-y-4 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.title}>
            {isOpen && (
              <p className="px-3 mb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                {group.title}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((menu) => {
                const Icon = menu.icon;
                const active = pathname === menu.href;
                return (
                  <li key={menu.name} className="relative group">
                    <Link
                      href={menu.href}
                      className={`flex items-center p-3 rounded-md relative overflow-hidden ${
                        active
                          ? "bg-gradient-to-r from-indigo-600/20 to-transparent text-white"
                          : "hover:bg-gradient-to-r from-indigo-600/20 to-transparent text-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-0 h-full w-1 bg-indigo-500 rounded-r" />
                      )}
                      <Icon className="w-5 h-5" />
                      {isOpen && <span className="ml-3">{menu.name}</span>}

                      {/* Tooltip kalau collapsed */}
                      {!isOpen && (
                        <span
                          className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
                            w-max bg-zinc-800 text-white text-xs font-medium rounded px-2 py-1
                            opacity-0 group-hover:opacity-100 transition-opacity scale-95 group-hover:scale-100
                            whitespace-nowrap z-50"
                        >
                          {menu.name}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Info */}
      {user && (
        <div className="p-2 border-t border-zinc-800">
          <a href="/profile">
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-zinc-800 p-2 rounded-lg">
              <div className="relative">
                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {/* Status dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-zinc-900"></span>
              </div>
              {isOpen && (
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              )}
            </div>
          </a>
        </div>
      )}
    </motion.div>
  );
}
