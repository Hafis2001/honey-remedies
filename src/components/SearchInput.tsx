"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <div className="w-full">
      {/* Search bar with bee decoration */}
      <div className="relative w-full">
        {/* Bee sitting on top right of the search bar */}
        <div
          className="absolute pointer-events-none"
          style={{ right: "-8px", top: "-44px", zIndex: 10 }}
        >
          {/* Honey drip effect */}
          <div
            className="absolute"
            style={{
              right: "38px",
              top: "52px",
              width: "6px",
              height: "30px",
              background: "linear-gradient(to bottom, #f59e0b, #d97706aa, transparent)",
              borderRadius: "0 0 50% 50%",
              filter: "blur(0.5px)",
            }}
          />
          <div
            className="absolute"
            style={{
              right: "32px",
              top: "58px",
              width: "4px",
              height: "18px",
              background: "linear-gradient(to bottom, #f59e0b, #d97706aa, transparent)",
              borderRadius: "0 0 50% 50%",
              filter: "blur(0.5px)",
            }}
          />
          {/* Honey drip drop at bottom */}
          <div
            className="absolute"
            style={{
              right: "35px",
              top: "82px",
              width: "8px",
              height: "10px",
              background: "#d97706",
              borderRadius: "50% 50% 60% 60%",
              opacity: 0.85,
            }}
          />
          <img
            src="/images/bee.png"
            alt="bee"
            style={{ width: "80px", height: "56px", objectFit: "contain", objectPosition: "right" }}
          />
        </div>

        {/* Actual search form */}
        <form
          onSubmit={handleSearch}
          className="flex items-center w-full rounded-full overflow-hidden shadow-sm"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div className="pl-5 flex items-center flex-shrink-0">
            <Search className="h-5 w-5" style={{ color: "#a19d98" }} />
          </div>
          <input
            type="text"
            className="flex-1 min-w-0 bg-transparent text-sm sm:text-base py-3.5 px-3 outline-none"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ color: "#1e1e1e" }}
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="btn-gold flex-shrink-0 px-5 sm:px-6 py-2.5 m-1.5 rounded-full text-sm font-bold whitespace-nowrap"
          >
            Search
          </motion.button>
        </form>
      </div>
    </div>
  );
}
