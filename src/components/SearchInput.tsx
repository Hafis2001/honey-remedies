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
          className="flex items-center w-full rounded-xl overflow-hidden"
          style={{
            background: "rgba(20, 8, 0, 0.65)",
            border: "1px solid rgba(251,191,36,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="pl-4 flex items-center flex-shrink-0">
            <Search className="h-5 w-5" style={{ color: "#d97706" }} />
          </div>
          <input
            type="text"
            className="flex-1 min-w-0 bg-transparent text-sm sm:text-base py-3 sm:py-4 px-2 sm:px-3 outline-none"
            placeholder="Search remedies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ color: "#fef3c7" }}
          />
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            className="btn-gold flex-shrink-0 px-3 sm:px-5 py-2 sm:py-3 m-1 sm:m-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
          >
            Search
          </motion.button>
        </form>
      </div>
    </div>
  );
}
