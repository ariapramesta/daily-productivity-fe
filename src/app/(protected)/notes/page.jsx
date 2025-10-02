"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
  const sentinelRef = useRef(null);

  const {
    notes,
    loading,
    fetchNotes,
    addNote,
    sortOrder,
    toggleSort,
    pagination,
  } = useNotesStore();

  // Initial fetch
  useEffect(() => {
    fetchNotes({ q: query, sortOrder, page: 1, append: false });
  }, [query, sortOrder]);

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((val) =>
      fetchNotes({ q: val, sortOrder, page: 1, append: false })
    ),
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

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          if (pagination.page < pagination.totalPages) {
            fetchNotes({
              q: query,
              sortOrder,
              page: pagination.page + 1,
              append: true,
            });
          }
        }
      },
      { root: null, rootMargin: "0px", threshold: 1.0 }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [
    sentinelRef.current,
    loading,
    pagination.page,
    pagination.totalPages,
    query,
    sortOrder,
  ]);

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
        {notes.length === 0 && !loading ? (
          <p className="text-zinc-400 text-center mt-10">No notes found.</p>
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

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-center mt-6">
            <div className="w-8 h-8 border-4 border-zinc-600 border-t-white rounded-full animate-spin"></div>
          </div>
        )}

        {/* Sentinel */}
        <div ref={sentinelRef} className="h-1"></div>

        {/* All loaded indicator */}
        {!loading &&
          pagination.page >= pagination.totalPages &&
          notes.length > 0 && (
            <p className="text-center text-green-500 mt-4">
              All notes loaded ✅
            </p>
          )}
      </main>
    </div>
  );
}
