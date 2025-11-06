"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { getNotes, getNote, updateNote } from "@/lib/notesApi";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    setLoading(true);
    const data = await getNotes();
    setNotes({
      list: data.data.notes,
      pagination: {
        page: data.data.page,
        total: data.data.total,
        totalPages: data.data.totalPages,
      },
    });
    setLoading(false);
  }

  async function selectNote(id) {
    const note = await getNote(id);
    setSelectedNote(note);
  }

  async function saveNote(id, title, content) {
    const updated = await updateNote(id, { title, content });
    setSelectedNote(updated);
    setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
  }

  return (
    <NotesContext.Provider
      value={{ notes, selectedNote, selectNote, saveNote, loading }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export const useNotes = () => useContext(NotesContext);
