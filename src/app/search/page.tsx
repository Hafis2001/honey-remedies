import { prisma } from "@/lib/prisma";
import Fuse from "fuse.js";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

async function getSearchResults(query: string) {
  const allRemedies = await prisma.remedy.findMany({
    include: {
      honeyVarieties: { include: { honeyVariety: true } },
    },
  });

  if (!query) return allRemedies;

  const fuse = new Fuse(allRemedies, {
    keys: [
      { name: "title", weight: 3 },
      { name: "ailmentTags", weight: 2 },
      { name: "description", weight: 1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    includeScore: true,
  });

  return fuse.search(query)
    .sort((a, b) => (a.score || 0) - (b.score || 0))
    .map(r => r.item);
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || "";
  const remedies = await getSearchResults(query);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "#d97706" }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      {/* Search Input */}
      <div className="glass-card rounded-2xl p-5">
        <SearchInput />
      </div>

      {/* Page heading */}
      <h1 className="font-playfair text-3xl font-bold" style={{ color: "#fbbf24" }}>
        {query ? `Results for "${query}"` : "All Remedies"}
      </h1>

      {/* Results */}
      {remedies.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4 gold-glow">🍯</div>
          <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: "#fbbf24" }}>No matches found</h2>
          <p style={{ color: "#f8fafc" }}>Try searching for "weight loss", "cough", or "indigestion".</p>
        </div>
      ) : (
        <motion.div
          initial="hidden" animate="show"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
          className="grid gap-4"
        >
          {remedies.map((remedy: any) => (
            <motion.div
              key={remedy.id}
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ scale: 1.012, y: -2 }}
            >
              <div className="glass-card glass-card-hover rounded-2xl overflow-hidden">
                {/* Card Header */}
                <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: "rgba(251,191,36,0.12)", background: "linear-gradient(135deg, rgba(120,53,15,0.25) 0%, rgba(20,8,0,0.15) 100%)" }}>
                  <Link href={`/remedy/${remedy.id}`}>
                    <h3 className="font-playfair text-2xl font-bold hover:opacity-80 transition-opacity" style={{ color: "#fef3c7" }}>
                      {remedy.title}
                    </h3>
                  </Link>
                </div>

                <div className="px-6 py-5 space-y-4">
                  {/* Ingredients preview */}
                  {(() => {
                    const ingredients: string[] = JSON.parse(remedy.ingredients || "[]");
                    return ingredients.length > 0 ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#d97706" }}>Ingredients</p>
                        <ul className="space-y-1">
                          {ingredients.map((ing: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: "#f8fafc" }}>
                              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#d97706" }} />
                              {ing}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null;
                  })()}

                  {/* Recommended Honey */}
                  {remedy.honeyVarieties.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "#d97706" }}>Recommended Honey</p>
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

                  {/* Indication preview */}
                  {remedy.usageInstructions && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "#d97706" }}>Indication</p>
                      <p className="text-sm line-clamp-2" style={{ color: "#f8fafc" }}>{remedy.usageInstructions}</p>
                    </div>
                  )}

                  {/* View Details button */}
                  <div className="pt-2">
                    <Link
                      href={`/remedy/${remedy.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
                      style={{ color: "#fbbf24" }}
                    >
                      View full details →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
