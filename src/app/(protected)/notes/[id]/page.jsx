"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { debounce } from "lodash";
import { useNotesStore } from "@/store/useNotesStore";
import ConfirmModal from "@/components/ConfirmModal";

export default function NotePage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    currentNote,
    noteLoading,
    noteSaving,
    fetchNote,
    saveNote,
    deleteCurrentNote,
  } = useNotesStore();

  const [localNote, setLocalNote] = useState({
    title: "Untitled Note",
    content: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Ambil note dari store
  useEffect(() => {
    if (id) fetchNote(id);

    return () => {
      const note = useNotesStore.getState().currentNote;
      if (note && note.title === "Untitled Note" && !note.content) {
        (async () => {
          await useNotesStore.getState().deleteCurrentNote(note.id);
        })();
      } else {
        useNotesStore.getState().clearCurrentNote();
      }
    };
  }, [id, fetchNote]);

  // Sinkronkan currentNote ke localNote
  useEffect(() => {
    if (currentNote) {
      setLocalNote({
        title: currentNote.title || "",
        content: currentNote.content || "",
      });
    }
  }, [currentNote]);

  // Debounce untuk simpan ke API
  const debouncedSave = useCallback(
    debounce((note) => {
      saveNote(id, {
        title: note.title,
        content: note.content,
        updatedAt: new Date(),
      });
    }, 500),
    [id, saveNote]
  );

  const handleChange = (field, value) => {
    setLocalNote((prev) => {
      const updated = { ...prev, [field]: value };
      debouncedSave(updated);
      return updated;
    });
  };

  const handleDelete = async () => {
    await deleteCurrentNote(id);
    router.push("/notes");
  };

  if (noteLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-400 animate-pulse">Loading note...</p>
      </div>
    );
  }

  if (!currentNote) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <p className="text-red-400">Note not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-zinc-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <input
            type="text"
            value={localNote.title}
            placeholder="Untitled Note"
            onChange={(e) => handleChange("title", e.target.value)}
            className="bg-transparent text-2xl font-bold focus:outline-none placeholder-zinc-600"
          />
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`text-sm transition-colors ${
              noteSaving ? "text-yellow-400 animate-pulse" : "text-zinc-500"
            }`}
          >
            {noteSaving ? "Saving..." : "All changes saved"}
          </span>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 transition-colors text-sm"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <textarea
        value={localNote.content}
        onChange={(e) => handleChange("content", e.target.value)}
        className="flex-1 p-6 bg-transparent focus:outline-none resize-none text-lg leading-relaxed placeholder-zinc-600 tracking-wide"
        placeholder="Start writing your note..."
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Note?"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="bg-red-600 hover:bg-red-500"
      />
    </div>
  );
}
