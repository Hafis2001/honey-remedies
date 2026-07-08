import { prisma } from "@/lib/prisma";
import Fuse from "fuse.js";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import * as motion from "framer-motion/client";

export const dynamic = 'force-dynamic';

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl mx-auto">

      {/* Search Input */}
      <div className="w-full mt-2">
        <SearchInput />
      </div>

      {/* Banner */}
      {/* Banner */}
      <a
        href="https://www.beecrafthoney.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="block relative w-full h-40 rounded-3xl overflow-hidden shadow-sm mt-6"
      >
        <img
          src="/images/banner_products.png"
          alt="BeeCraft Honey Products"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Honey Drip Top Corner */}
        <svg className="absolute top-0 left-0 w-32 h-24 z-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="honey-grad-banner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#FF8C00" />
            </linearGradient>
            <filter id="honey-glow-banner">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#FF9D00" floodOpacity="0.4" />
            </filter>
          </defs>
          <path
            fill="url(#honey-grad-banner)"
            filter="url(#honey-glow-banner)"
            d="M0,0 L100,0 C90,10 85,25 80,45 C75,65 70,75 60,75 C50,75 45,45 40,25 C35,5 30,5 25,35 C20,65 15,75 10,75 C5,75 0,35 0,0 Z"
          />
        </svg>
      </a>

      {/* Count */}
      <div className="flex justify-between items-end px-1 mt-6 mb-2">
        <h3 className="font-inter text-lg font-bold text-gray-900">Remedies</h3>
        <p className="text-xs font-medium text-gray-400">
          {query
            ? `${remedies.length} result${remedies.length !== 1 ? "s" : ""} for "${query}"`
            : "See All"}
        </p>
      </div>

      {/* Results */}
      {remedies.length === 0 ? (
        <div className="glass-card p-12 text-center mt-4">
          <div className="text-6xl mb-4">🍯</div>
          <h2 className="font-inter text-xl font-bold mb-2 text-gray-900">No matches found</h2>
          <p className="text-gray-500 text-sm">Try a different search term.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden" animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 py-2"
        >
          {remedies.map((remedy: any) => {
            return (
              <motion.div
                key={remedy.id}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              >
                <Link href={`/remedy/${remedy.id}`} className="block">
                  <div className="hex-wrapper">
                    <div className="hex-card">
                      {/* Honey Drip Top */}
                      <svg className="absolute top-0 left-0 w-full h-[45%] z-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0px 4px 6px rgba(255,157,0,0.5))' }}>
                        <defs>
                          <linearGradient id={`honey-grad-${remedy.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFC107" />
                            <stop offset="40%" stopColor="#FF9800" />
                            <stop offset="100%" stopColor="#E65100" />
                          </linearGradient>
                          <linearGradient id={`honey-highlight-${remedy.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path
                          fill={`url(#honey-grad-${remedy.id})`}
                          d="M0,0 L100,0 L100,10 C95,10 90,40 85,40 C80,40 75,10 70,10 C65,10 60,60 55,60 C50,60 45,20 40,20 C35,20 30,70 25,70 C20,70 15,10 10,10 C5,10 0,30 0,30 Z"
                        />
                        <path
                          fill={`url(#honey-highlight-${remedy.id})`}
                          d="M0,0 L100,0 L100,8 C95,8 90,36 85,36 C80,36 75,8 70,8 C65,8 60,55 55,55 C50,55 45,18 40,18 C35,18 30,65 25,65 C20,65 15,8 10,8 C5,8 0,26 0,26 Z"
                          opacity="0.4"
                        />
                      </svg>
                      <div className="hex-card-inner">
                        <span className="text-2xl leading-none">🍯</span>
                        <h2 className="font-inter text-[11px] font-bold text-gray-900 leading-tight line-clamp-3">
                          {remedy.title}
                        </h2>
                        <span className="text-orange-400 text-[10px] font-black leading-none">➔</span>
                      </div>
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
