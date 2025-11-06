import NoteEditor from "./components/NoteEditor";
import NoteList from "./components/NoteList";

export default function Notes() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <NoteList />
      <NoteEditor />
    </div>
  );
}
