"use client";
import { useNotes } from "@/context/NotesContext";
import { Search, SquarePen } from "lucide-react";

export default function NoteList() {
  const { notes, selectNote, selectedNote, loading } = useNotes();

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <aside className="w-1/4 border-r border-neutral-800 bg-neutral-900 overflow-y-scroll scrollbar-hide">
      <div className="p-4 border-b border-neutral-800 flex justify-between items-center">
        <h2 className="font-semibold text-lg">All Notes</h2>
        <SquarePen className="w-5 h-5" />
      </div>
      <div className="flex py-3 px-4 gap-2 border-b border-neutral-800">
        <label htmlFor="search">
          <Search />
        </label>
        <input
          type="search"
          name="search"
          id="search"
          placeholder="Search..."
          className="w-full bg-neutral-900"
        />
      </div>
      <ul>
        {notes?.list?.map((note) => (
          <li
            key={note.id}
            className={`p-3 cursor-pointer hover:bg-neutral-800 m-4 ${
              selectedNote?.id === note.id ? "bg-neutral-800 rounded-md" : ""
            }`}
            onClick={() => selectNote(note.id)}
          >
            <p className="font-medium text-neutral-100 truncate mb-2">
              {note.title}
            </p>
            <p className="text-sm text-neutral-400 truncate">
              {note.content || "No content yet..."}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
