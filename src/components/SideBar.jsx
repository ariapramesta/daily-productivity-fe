"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  StickyNote,
  ListTodo,
  Wallet,
  Folder,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

export default function Sidebar() {
  const { isOpen, setIsOpen } = useSidebar();
  const pathname = usePathname();

  const menus = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Notes", href: "/notes", icon: StickyNote },
    { name: "Todos", href: "/todos", icon: ListTodo },
    { name: "Expenses", href: "/expenses", icon: Wallet },
    { name: "Projects", href: "/projects", icon: Folder },
  ];

  return (
    <div
      className={`h-screen bg-zinc-900 text-gray-200 transition-all duration-300  
        ${isOpen ? "w-64" : "w-16"} flex flex-col border-r border-zinc-800`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        {isOpen && <h1 className="text-lg font-bold">Productivity</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded hover:bg-zinc-800"
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 mt-4 px-2">
        <ul className="space-y-1">
          {menus.map((menu) => {
            const Icon = menu.icon;
            const active = pathname === menu.href;

            return (
              <li key={menu.name} className="relative group">
                <Link
                  href={menu.href}
                  className={`flex items-center p-3 rounded-md transition-colors relative
                    ${
                      active
                        ? "bg-zinc-800 text-white"
                        : "hover:bg-zinc-800 hover:text-white"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {isOpen && <span className="ml-3">{menu.name}</span>}

                  {/* Tooltip */}
                  {!isOpen && (
                    <span
                      className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
                        w-max bg-zinc-800 text-white text-xs font-medium rounded px-2 py-1
                        opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50"
                    >
                      {menu.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
