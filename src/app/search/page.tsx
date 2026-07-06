import { prisma } from "@/lib/prisma";
import Fuse from "fuse.js";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";
import * as motion from "framer-motion/client";

export const dynamic = 'force-dynamic';

// Helper to determine shop URL for each honey type
function getShopUrl(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("black forest")) return "https://www.beecrafthoney.com/product/Honey/1/3/101/Black-Forest-Honey---500gm-3";
  if (n.includes("sidr")) return "https://www.beecrafthoney.com/product/Honey/1/3/101/Sidr-Honey";
  if (n.includes("manuka")) return "https://www.beecrafthoney.com/product/Honey/1/3/101/Manuka-Honey";
  if (n.includes("saffron")) return "https://www.beecrafthoney.com/product/Honey/1/3/101/Saffron-Honey";
  if (n.includes("mustard")) return "https://www.beecrafthoney.com/product/Honey/1/3/101/Mustard-Honey";
  if (n.includes("tulsi")) return "https://www.beecrafthoney.com/product/Honey/1/3/101/Tulsi-Honey";
  if (n.includes("ajwain")) return "https://www.beecrafthoney.com/product/Honey/1/3/101/Ajwain-Honey";
  return "https://www.beecrafthoney.com/";
}

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
            const ingredients: string[] = JSON.parse(remedy.ingredients || "[]");
            return (
              <motion.div
                key={remedy.id}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.01, y: -2 }}
              >
                <div className="glass-card glass-card-hover rounded-2xl overflow-visible relative">
                  {/* Bee on top-right corner of card */}
                  <img
                    src="/images/bee.png"
                    alt="bee"
                    className="absolute pointer-events-none"
                    style={{
                      width: "70px",
                      height: "50px",
                      objectFit: "contain",
                      objectPosition: "right",
                      top: "-22px",
                      right: "-10px",
                      zIndex: 10,
                      filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))",
                    }}
                  />

                  {/* ── Title ── */}
                  <div className="px-6 pt-5 pb-4 border-b" style={{ borderColor: "rgba(251,191,36,0.15)", background: "linear-gradient(135deg, rgba(120,53,15,0.3) 0%, rgba(20,8,0,0.2) 100%)" }}>
                    <h2 className="font-playfair text-2xl font-bold" style={{ color: "#fef3c7" }}>
                      {remedy.title}
                    </h2>
                  </div>

                  <div className="px-6 py-5 space-y-5">

                    {/* ── Ingredients ── */}
                    {ingredients.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#fbbf24" }}>Ingredients</p>
                        <ul className="space-y-1.5">
                          {ingredients.map((ing: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#f8fafc" }}>
                              <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: "#d97706" }} />
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* ── Recommended Honey ── */}
                    {remedy.honeyVarieties.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#fbbf24" }}>Recommended Honey</p>
                        <div className="flex flex-wrap gap-2">
                          {remedy.honeyVarieties.map((hv: any) => (
                            <a
                              key={hv.honeyVariety.id}
                              href={getShopUrl(hv.honeyVariety.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold btn-gold"
                            >
                              🍯 {hv.honeyVariety.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ── Indication ── */}
                    {remedy.usageInstructions && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#fbbf24" }}>Indication</p>
                        <p className="text-sm leading-relaxed" style={{ color: "#f8fafc" }}>{remedy.usageInstructions}</p>
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
