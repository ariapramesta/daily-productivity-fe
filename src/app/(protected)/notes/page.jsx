"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/SideBar";
import { List, Grid2X2, ArrowUpDown } from "lucide-react";
import { getNotes } from "@/lib/notesApi";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes();
        setNotes(data);
      } catch (err) {
        console.error("Failed to load notes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 p-6 transition-all duration-300 relative">
        {/* Floating Add Button */}
        <button className="absolute bottom-5 right-5 py-4 px-6 text-2xl rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800">
          +
        </button>

        {/* Toolbar */}
        <div className="flex items-center justify-center gap-4 w-full mb-6">
          {/* Toggle View (List / Grid) */}
          <button
            onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
          >
            {viewMode === "list" ? (
              <Grid2X2 className="w-5 h-5 text-white" />
            ) : (
              <List className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Search */}
          <form action="post" className="flex-1 max-w-lg">
            <input
              type="search"
              name="q"
              id="search"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </form>

          {/* Sort Button */}
          <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition">
            <ArrowUpDown className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Notes Section */}
        {loading ? (
          <p className="text-zinc-400 text-center">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-zinc-400 text-center">No notes found.</p>
        ) : viewMode === "grid" ? (
          // GRID MODE
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="rounded-2xl bg-zinc-800 shadow-lg hover:shadow-xl hover:bg-zinc-700 transition cursor-pointer flex flex-col p-5"
              >
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-4 flex-1">
                  {note.content}
                </p>
                <div className="mt-4 text-right">
                  <span className="text-xs text-zinc-500">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // LIST MODE
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-lg bg-zinc-800 shadow hover:bg-zinc-700 transition cursor-pointer flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {note.title}
                  </h3>
                  <p className="text-sm text-zinc-400">{note.content}</p>
                </div>
                <span className="text-xs text-zinc-500">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
