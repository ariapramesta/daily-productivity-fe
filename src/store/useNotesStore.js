import { create } from "zustand";
import { getNotes, createNote, deleteNote, getNote, updateNote } from "@/lib/notesApi";

export const useNotesStore = create((set, get) => ({
    // ----- LIST STATE -----
    notes: [],
    loading: false,
    sortOrder: "desc",
    pagination: { total: 0, page: 0, limit: 20, totalPages: 0 },

    // Fetch notes (pagination + search + sort)
    fetchNotes: async ({ q = "", sortOrder = "desc", page = 1, append = true }) => {
        set({ loading: true });
        try {
            const res = await getNotes({ search: q, sortOrder, page });

            const notesData = res.data?.notes || [];
            const meta = {
                total: res.data?.total || 0,
                page: res.data?.page || 1,
                limit: res.data?.limit || 20,
                totalPages: res.data?.totalPages || 1,
            };

            set((state) => ({
                notes: append ? [...(state.notes || []), ...notesData] : notesData,
                pagination: meta,
                loading: false,
                sortOrder,
            }));
        } catch (err) {
            console.error("Failed to fetch notes:", err);
            set({ loading: false });
        }
    },


    // Add new note
    addNote: async () => {
        try {
            const newNote = await createNote("Untitled Note", "");
            set((state) => ({ notes: [newNote, ...(state.notes || [])] }));
            return newNote;
        } catch (err) {
            console.error("Failed to create note:", err);
        }
    },

    // Delete note
    removeNote: async (id) => {
        try {
            await deleteNote(id);
            set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
        } catch (err) {
            console.error("Failed to delete note:", err);
        }
    },

    toggleSort: () => {
        set((state) => ({ sortOrder: state.sortOrder === "desc" ? "asc" : "desc" }));
    },

    // ----- DETAIL STATE -----
    currentNote: null,
    noteLoading: false,
    noteSaving: false,

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

    saveNote: async (id, updates) => {
        set({ noteSaving: true });
        try {
            const updated = await updateNote(id, updates);
            set((state) => {
                const merged = { ...state.currentNote, ...updates, ...updated };
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

    clearCurrentNote: () => {
        set({ currentNote: null, noteLoading: false, noteSaving: false });
    },
}));
