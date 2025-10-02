"use client";
import NoteCard from "./NotesCard";

export default function NotesGrid({ notes, onNoteClick }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} onClick={() => onNoteClick(note)} />
      ))}
    </div>
  );
}
