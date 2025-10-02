export default function NotesSkeleton({ viewMode = "grid", count = 6 }) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-32 bg-zinc-800 rounded-md animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-16 bg-zinc-800 rounded-md animate-pulse"
        ></div>
      ))}
    </div>
  );
}
