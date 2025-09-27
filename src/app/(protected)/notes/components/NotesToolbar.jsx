"use client";
import { List, Grid2X2, ArrowDown01, ArrowUp01 } from "lucide-react";

export default function NotesToolbar({
  viewMode,
  setViewMode,
  query,
  onSearch,
  sortOrder,
  onToggleSort,
}) {
  return (
    <div className="flex items-center justify-center gap-4 w-full mb-6">
      {/* Toggle View (List / Grid) */}
      <button
        onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
      >
        {viewMode === "list" ? (
          <Grid2X2 className="w-5 h-5 text-white" />
        ) : (
          <List className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Search */}
      <form action="post" className="flex-1 max-w-lg">
        <input
          type="search"
          value={query}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search..."
          className="w-full px-4 py-2 rounded-lg bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        />
      </form>

      {/* Sort Button */}
      <button
        onClick={onToggleSort}
        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition"
      >
        {sortOrder === "desc" ? (
          <ArrowUp01 className="w-5 h-5 text-white" />
        ) : (
          <ArrowDown01 className="w-5 h-5 text-white" />
        )}
      </button>
    </div>
  );
}
