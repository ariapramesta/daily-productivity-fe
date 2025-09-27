"use client";

export default function NoteCard({ note, onClick, previewLength = 120 }) {
  const getPreview = (text, length = 100) => {
    if (!text) return "";
    const cleanText = text.replace(/\n+/g, " ");
    return cleanText.length > length
      ? cleanText.substring(0, length) + "..."
      : cleanText;
  };

  return (
    <div
      onClick={onClick}
      className="rounded-2xl bg-zinc-800 shadow-lg hover:shadow-xl hover:bg-zinc-700 transition cursor-pointer flex flex-col p-5 h-48"
    >
      <h3 className="text-lg font-bold text-white mb-3 line-clamp-1">
        {note.title}
      </h3>
      <p className="text-sm text-zinc-400 line-clamp-4 flex-1 overflow-hidden">
        {getPreview(note.content, previewLength)}
      </p>
      <div className="mt-4 text-right">
        <span className="text-xs text-zinc-500">
          {new Date(note.updatedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
