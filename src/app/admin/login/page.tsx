"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="flex justify-center mt-20">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-honey-100 w-full max-w-md">
        <h1 className="text-2xl font-bold text-honey-950 mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-honey-800 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-honey-300 rounded-lg focus:ring-2 focus:ring-honey-500 focus:border-honey-500"
              placeholder="Enter admin password"
            />
            <p className="text-xs text-honey-600 mt-1">Default password for MVP is "honeyadmin"</p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 bg-honey-500 text-white rounded-lg font-medium hover:bg-honey-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
