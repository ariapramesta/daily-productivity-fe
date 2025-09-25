"use client";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import Sidebar from "@/components/SideBar";
import { List, Grid2X2, ArrowDown01, ArrowUp01 } from "lucide-react";
import { createNote, getNotes } from "@/lib/notesApi";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchNotes = async (q = "") => {
    try {
      setLoading(true);
      const res = await getNotes({ search: q, sortOrder });
      setNotes(res.data || []);
    } catch (err) {
      console.error("Failed to load notes:", err);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [sortOrder]);

  const sortedNotes = [...notes].sort((a, b) => {
    if (sortOrder === "desc") {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else {
      return new Date(a.updatedAt) - new Date(b.updatedAt);
    }
  });

  const handleAddNote = async () => {
    try {
      const newNote = await createNote("Untitled Note", "");
      router.push(`/notes/${newNote.id}`);
    } catch (err) {
      console.error("failed to create note:", err);
    }
  };

  const debouncedSearch = useCallback(
    debounce((val) => {
      fetchNotes(val);
    }, 500),
    []
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  };

  const getPreview = (text, length = 100) => {
    if (!text) return "";
    const cleanText = text.replace(/\n+/g, " ");
    return cleanText.length > length
      ? cleanText.substring(0, length) + "..."
      : cleanText;
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 p-6 transition-all duration-300 relative">
        {/* Floating Add Button */}
        <button
          onClick={handleAddNote}
          className="absolute bottom-5 right-5 py-4 px-6 text-2xl rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
        >
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
              value={query}
              onChange={handleChange}
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </form>

          {/* Sort Button */}
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
          >
            {sortOrder === "desc" ? (
              <ArrowDown01 className="w-5 h-5 text-white" />
            ) : (
              <ArrowUp01 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Notes Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
            <div className="w-12 h-12 border-4 border-zinc-600 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-zinc-400 animate-pulse">
              Loading your notes...
            </p>
          </div>
        ) : sortedNotes.length === 0 ? (
          <p className="text-zinc-400 text-center">No notes found.</p>
        ) : viewMode === "grid" ? (
          // GRID MODE
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {sortedNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => router.push(`/notes/${note.id}`)}
                className="rounded-2xl bg-zinc-800 shadow-lg hover:shadow-xl hover:bg-zinc-700 transition cursor-pointer flex flex-col p-5 h-48"
              >
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-1">
                  {note.title}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-4 flex-1 overflow-hidden">
                  {getPreview(note.content, 120)}
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
                onClick={() => router.push(`/notes/${note.id}`)}
                className="p-4 rounded-lg bg-zinc-800 shadow hover:bg-zinc-700 transition cursor-pointer flex justify-between items-center h-24"
              >
                <div className="overflow-hidden">
                  <h3 className="text-lg font-semibold text-white line-clamp-1">
                    {note.title}
                  </h3>
                  <p className="text-sm text-zinc-400 line-clamp-1">
                    {getPreview(note.content, 80)}
                  </p>
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
