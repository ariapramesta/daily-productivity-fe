"use client";
import { useNotes } from "@/context/NotesContext";
import { useState, useEffect } from "react";

export default function NoteEditor() {
  const { selectedNote, saveNote } = useNotes();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (selectedNote) setContent(selectedNote.content || "");
  }, [selectedNote]);

  if (!selectedNote)
    return (
      <div className="flex-1 flex items-center justify-center text-neutral-500">
        Select a note
      </div>
    );

  const handleSave = () => {
    saveNote(selectedNote.id, content);
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-900 text-neutral-100">
      <div className="flex items-center justify-between p-4 border-b border-neutral-800">
        <h2 className="font-semibold text-lg">{selectedNote.title}</h2>
        <button
          onClick={handleSave}
          className="text-sm bg-neutral-700 px-3 py-1 rounded hover:bg-neutral-600"
        >
          Save
        </button>
      </div>
      <textarea
        className="flex-1 bg-neutral-900 outline-none p-4 resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
  );
}
