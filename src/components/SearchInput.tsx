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
    }
  };

  const commonAilments = ["cough", "sore throat", "cold", "wounds", "indigestion", "insomnia", "cramps"];

  return (
    <div className="w-full">
      {/* Search bar row */}
      <form
        onSubmit={handleSearch}
        className="flex items-center w-full rounded-xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(251,191,36,0.35)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="pl-4 flex items-center flex-shrink-0">
          <Search className="h-5 w-5" style={{ color: "#d97706" }} />
        </div>
        <input
          type="text"
          className="flex-1 min-w-0 bg-transparent text-sm sm:text-base py-3 sm:py-4 px-2 sm:px-3 outline-none"
          placeholder="What's bothering you today?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ color: "#fef3c7" }}
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="btn-gold flex-shrink-0 px-3 sm:px-4 py-2 sm:py-3 m-1 sm:m-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap"
        >
          Search
        </motion.button>
      </form>

      {/* Popular searches below */}
      <div className="mt-5">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: "#b45309" }}
        >
          Popular searches
        </p>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.07 } },
          }}
          className="flex flex-wrap gap-2"
        >
          {commonAilments.map((ailment) => (
            <motion.button
              key={ailment}
              variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
              whileHover={{ scale: 1.07, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/search?q=${encodeURIComponent(ailment)}`)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: "rgba(217, 119, 6, 0.15)",
                border: "1px solid rgba(251, 191, 36, 0.25)",
                color: "#fcd34d",
              }}
            >
              {ailment}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
