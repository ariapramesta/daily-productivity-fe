import { create } from "zustand";
import {
    getNotes,
    createNote,
    deleteNote,
    getNote,
    updateNote,
} from "@/lib/notesApi";

export const useNotesStore = create((set, get) => ({
    // ----- LIST STATE -----
    notes: [],
    loading: false,
    sortOrder: "desc",

    // Fetch all notes
    fetchNotes: async (q = "", sortOrder = "desc") => {
        set({ loading: true });
        try {
            const res = await getNotes({ search: q, sortOrder });
            set({ notes: res.data || [], loading: false, sortOrder });
        } catch (err) {
            console.error("Failed to fetch notes:", err);
            set({ loading: false });
        }
    },

    // Add note
    addNote: async () => {
        try {
            const newNote = await createNote("Untitled Note", "");
            set((state) => ({ notes: [newNote, ...state.notes] }));
            return newNote;
        } catch (err) {
            console.error("Failed to create note:", err);
        }
    },

    // Remove note
    removeNote: async (id) => {
        try {
            await deleteNote(id);
            set((state) => ({
                notes: state.notes.filter((n) => n.id !== id),
            }));
        } catch (err) {
            console.error("Failed to delete note:", err);
        }
    },

    // Toggle sort order
    toggleSort: () => {
        set((state) => ({
            sortOrder: state.sortOrder === "desc" ? "asc" : "desc",
        }));
    },

    // ----- DETAIL STATE -----
    currentNote: null,
    noteLoading: false,
    noteSaving: false,

    // Fetch single note
    fetchNote: async (id) => {
        set({ noteLoading: true });
        try {
            const note = await getNote(id);
            set({ currentNote: note, noteLoading: false });
            return note;
        } catch (err) {
            console.error("Failed to fetch note:", err);
            set({ noteLoading: false, currentNote: null });
        }
    },

    // Update single note
    saveNote: async (id, updates) => {
        set({ noteSaving: true });
        try {
            const updated = await updateNote(id, updates);

            set((state) => {
                const merged = {
                    ...state.currentNote,
                    ...updates,   // merge local updates
                    ...updated,   // merge API response (kalau ada)
                };
                return {
                    currentNote: merged,
                    notes: state.notes.map((n) => (n.id === id ? merged : n)),
                    noteSaving: false,
                };
            });

        } catch (err) {
            console.error("Failed to update note:", err);
            set({ noteSaving: false });
        }
    },


    // Delete single note (also update list)
    deleteCurrentNote: async (id) => {
        try {
            await deleteNote(id);
            set((state) => ({
                notes: state.notes.filter((n) => n.id !== id),
                currentNote: null,
            }));
        } catch (err) {
            console.error("Failed to delete current note:", err);
        }
    },

    // Reset state when leaving NotePage
    clearCurrentNote: () => {
        set({ currentNote: null, noteLoading: false, noteSaving: false });
    },
}));
