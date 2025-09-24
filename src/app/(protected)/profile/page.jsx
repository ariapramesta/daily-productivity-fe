"use client";
import { useState } from "react";
import { LogOut, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { logoutApi } from "@/lib/authApi";
import Link from "next/link";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi();
      logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {!user ? (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 text-white">
          <p>Loading profile...</p>
        </div>
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-black to-zinc-900 px-4">
          <div className="w-full max-w-md bg-zinc-800 rounded-2xl shadow-2xl p-8 space-y-6 relative">
            <Link
              href="/"
              className="absolute top-4 left-4 p-2 hover:bg-zinc-700 rounded-full flex items-center justify-center"
            >
              <ArrowLeft className="w-6 h-6 text-zinc-400" />
            </Link>

            <h1 className="text-3xl font-bold text-center text-white mt-4">
              Profile
            </h1>

            <div className="flex flex-col items-center space-y-4 mt-4">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-zinc-600 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-zinc-700 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg border-4 border-zinc-600">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="text-center text-white mt-2">
                <p className="text-xl font-semibold">{user.name}</p>
                <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                className="p-2 hover:bg-zinc-700 rounded-full"
              >
                <LogOut className="w-6 h-6 text-red-400" />
              </button>
            </div>

            {/* Modal Confirmation */}
            {showConfirm && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                <div className="bg-zinc-800 p-6 rounded-xl shadow-2xl w-80 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white">
                      Confirm Logout
                    </h2>
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="p-1 hover:bg-zinc-700 rounded-full"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <p className="text-sm text-zinc-300">
                    Are you sure you want to log out?
                  </p>
                  <div className="flex justify-end gap-3 mt-2">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="px-4 py-2 rounded-lg bg-zinc-700 text-white hover:bg-zinc-600 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
