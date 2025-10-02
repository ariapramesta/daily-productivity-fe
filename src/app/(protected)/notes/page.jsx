"use client";
import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/SideBar";
import NotesToolbar from "./components/NotesToolbar";
import NotesGrid from "./components/NotesGrid";
import NotesList from "./components/NotesList";
import { useNotesStore } from "@/store/useNotesStore";

export default function NotesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [query, setQuery] = useState("");

  const router = useRouter();
  const { notes, loading, fetchNotes, addNote, sortOrder, toggleSort } =
    useNotesStore();

  useEffect(() => {
    fetchNotes({ q: query, page: 1, sortOrder });
  }, [query, sortOrder]);

  const debouncedSearch = useCallback(
    debounce((val) => {
      fetchNotes({ q: val, page: 1, sortOrder });
    }, 500),
    [sortOrder]
  );

  const handleSearch = (val) => {
    setQuery(val);
    debouncedSearch(val);
  };

  const handleAddNote = async () => {
    const newNote = await addNote();
    if (newNote) router.push(`/notes/${newNote.id}`);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <main className="flex-1 p-6 md:py-6 md:px-10 transition-all duration-300 overflow-y-auto">
        {/* Floating Add Button */}
        <button
          onClick={handleAddNote}
          className="absolute bottom-5 right-5 py-4 px-6 text-2xl rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
        >
          +
        </button>

        {/* Toolbar */}
        <NotesToolbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          query={query}
          onSearch={handleSearch}
          sortOrder={sortOrder}
          onToggleSort={toggleSort}
        />

        {/* Notes Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
            <div className="w-12 h-12 border-4 border-zinc-600 border-t-white rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-zinc-400 animate-pulse">
              Loading your notes...
            </p>
          </div>
        ) : notes.length === 0 ? (
          <p className="text-zinc-400 text-center">No notes found.</p>
        ) : viewMode === "grid" ? (
          <NotesGrid
            notes={notes}
            onNoteClick={(note) => router.push(`/notes/${note.id}`)}
          />
        ) : (
          <NotesList
            notes={notes}
            onNoteClick={(note) => router.push(`/notes/${note.id}`)}
          />
        )}
      </main>
    </div>
  );
}
