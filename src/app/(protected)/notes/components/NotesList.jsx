"use client";

export default function NotesList({ notes, onNoteClick }) {
  const getPreview = (text, length = 80) => {
    if (!text) return "";
    const cleanText = text.replace(/\n+/g, " ");
    return cleanText.length > length
      ? cleanText.substring(0, length) + "..."
      : cleanText;
  };

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          onClick={() => onNoteClick(note)}
          className="p-4 rounded-lg bg-zinc-800 shadow hover:bg-zinc-700 transition cursor-pointer flex justify-between items-center h-24"
        >
          <div className="overflow-hidden">
            <h3 className="text-lg font-semibold text-white line-clamp-1">
              {note.title}
            </h3>
            <p className="text-sm text-zinc-400 line-clamp-1">
              {getPreview(note.content)}
            </p>
          </div>
          <span className="text-xs text-zinc-500">
            {new Date(note.updatedAt).toLocaleDateString()}
          </span>
        </div>
      ))}
    </div>
  );
}
