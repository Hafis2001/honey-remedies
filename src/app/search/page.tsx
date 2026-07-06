import { prisma } from "@/lib/prisma";
import Fuse from "fuse.js";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import * as motion from "framer-motion/client";

import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

// Removed unused getShopUrl function

async function getRemedies(query: string) {
  const allRemedies = await prisma.remedy.findMany({
    include: {
      honeyVarieties: { include: { honeyVariety: true } },
    },
    orderBy: { title: "asc" },
  });

  if (!query) return allRemedies;

  const fuse = new Fuse(allRemedies, {
    keys: [
      { name: "title", weight: 3 },
      { name: "ailmentTags", weight: 2 },
      { name: "description", weight: 1 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
  });

  return fuse.search(query).map(r => r.item);
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || "";
  const remedies = await getRemedies(query);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl mx-auto pt-12">

      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 -mt-6 mb-2" style={{ color: "#d97706" }}>
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      {/* Search Input */}
      <div className="glass-card rounded-2xl p-4">
        <SearchInput />
      </div>

      {/* Count */}
      <p className="text-sm" style={{ color: "#d97706" }}>
        {query
          ? `${remedies.length} result${remedies.length !== 1 ? "s" : ""} for "${query}"`
          : `${remedies.length} remedy${remedies.length !== 1 ? "ies" : ""} available`}
      </p>

      {/* Results */}
      {remedies.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4 gold-glow">🍯</div>
          <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: "#fbbf24" }}>No matches found</h2>
          <p style={{ color: "#f8fafc" }}>Try a different search term.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden" animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
          className="grid gap-5"
        >
          {remedies.map((remedy: any) => {
              return (
              <motion.div
                key={remedy.id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Link href={`/remedy/${remedy.id}`} className="block">
                  <div className="glass-card glass-card-hover rounded-2xl overflow-visible relative">
                    {/* Bee on top-right corner of card */}
                    <img
                      src="/images/bee.png"
                      alt="bee"
                      className="absolute pointer-events-none"
                      style={{
                        width: "60px",
                        height: "40px",
                        objectFit: "contain",
                        objectPosition: "right",
                        top: "-15px",
                        right: "-5px",
                        zIndex: 10,
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                      }}
                    />

                    {/* ── Title ── */}
                    <div className="px-6 py-6" style={{ background: "linear-gradient(135deg, rgba(120,53,15,0.4) 0%, rgba(20,8,0,0.3) 100%)", borderRadius: "1rem" }}>
                      <h2 className="font-playfair text-2xl font-bold flex items-center justify-between" style={{ color: "#fef3c7" }}>
                        {remedy.title}
                        <span className="text-amber-500 text-lg">➔</span>
                      </h2>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
