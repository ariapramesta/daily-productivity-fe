"use client";
import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNote, updateNote, deleteNote } from "@/lib/notesApi";
import { ArrowLeft, Trash2 } from "lucide-react";
import { debounce } from "lodash";

export default function NotePage() {
  const { id } = useParams();
  const router = useRouter();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await getNote(id);
        setNote(data);
      } catch (err) {
        console.error("Failed to load note:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, router]);

  const debouncedSave = useMemo(
    () =>
      debounce(async (updated) => {
        try {
          setSaving(true);
          await updateNote(id, {
            title: updated.title,
            content: updated.content,
          });
        } catch (err) {
          console.error("Failed to save:", err);
        } finally {
          setSaving(false);
        }
      }, 500),
    [id]
  );

  const handleChange = (field, value) => {
    const updated = { ...note, [field]: value, updatedAt: new Date() };
    setNote(updated);
    debouncedSave(updated);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    try {
      await deleteNote(id);
      router.push("/notes");
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <p className="text-zinc-400 animate-pulse">Loading note...</p>
      </div>
    );
  }

  if (!note) {
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
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <input
            type="text"
            value={note.title || ""}
            placeholder="Untitled Note"
            onChange={(e) => handleChange("title", e.target.value)}
            className="bg-transparent text-2xl font-bold focus:outline-none placeholder-zinc-600"
          />
        </div>

        <div className="flex items-center gap-4">
          <span
            className={`text-sm transition-colors ${
              saving ? "text-yellow-400 animate-pulse" : "text-zinc-500"
            }`}
          >
            {saving ? "Saving..." : "All changes saved"}
          </span>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 transition-colors text-sm"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <textarea
        value={note.content || ""}
        onChange={(e) => handleChange("content", e.target.value)}
        className="flex-1 p-6 bg-transparent focus:outline-none resize-none text-lg leading-relaxed placeholder-zinc-600 tracking-wide"
        placeholder="Start writing your note..."
      />
    </div>
  );
}
