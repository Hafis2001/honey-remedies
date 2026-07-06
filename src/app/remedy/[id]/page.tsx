import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import * as motion from "framer-motion/client";

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

export default async function RemedyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const remedy = await prisma.remedy.findUnique({
    where: { id },
    include: { honeyVarieties: { include: { honeyVariety: true } } },
  });
  if (!remedy) notFound();

  const ingredients: string[] = JSON.parse(remedy.ingredients);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5 max-w-3xl mx-auto"
    >
      {/* Back button */}
      <Link href="/search" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80" style={{ color: "#d97706" }}>
        <ArrowLeft className="w-4 h-4" /> Back to search
      </Link>

      {/* Main card */}
      <div className="glass-card rounded-3xl overflow-hidden">

        {/* ── Title ── */}
        <div className="p-8 border-b border-amber-900/30" style={{ background: "linear-gradient(135deg, rgba(120,53,15,0.35) 0%, rgba(20,8,0,0.25) 100%)" }}>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl md:text-4xl font-black"
            style={{ color: "#fef3c7" }}
          >
            {remedy.title}
          </motion.h1>
        </div>

        <div className="p-6 md:p-8 space-y-8">

          {/* ── Ingredients ── */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 className="font-playfair text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b" style={{ color: "#fbbf24", borderColor: "rgba(251,191,36,0.2)" }}>
              🧪 Ingredients
            </h2>
            <ul className="space-y-3">
              {ingredients.map((ingredient: string, i: number) => (
                <li key={i} className="flex items-start gap-3" style={{ color: "#f8fafc" }}>
                  <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: "#d97706" }} />
                  <span className="text-base">{ingredient}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Recommended Honey ── */}
          {remedy.honeyVarieties.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <h2 className="font-playfair text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b" style={{ color: "#fbbf24", borderColor: "rgba(251,191,36,0.2)" }}>
                🍯 Recommended Honey
              </h2>
              <div className="space-y-3">
                {remedy.honeyVarieties.map(({ honeyVariety }) => (
                  <div key={honeyVariety.id} className="flex items-center justify-between gap-4 rounded-xl px-5 py-4" style={{ background: "rgba(120,53,15,0.25)", border: "1px solid rgba(251,191,36,0.2)" }}>
                    <span className="font-semibold text-base" style={{ color: "#fef3c7" }}>{honeyVariety.name}</span>
                    <a
                      href={getShopUrl(honeyVariety.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold whitespace-nowrap text-xs font-bold px-4 py-2 rounded-lg flex-shrink-0"
                    >
                      Shop Now
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Indication ── */}
          {remedy.usageInstructions && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <h2 className="font-playfair text-xl font-bold mb-4 flex items-center gap-2 pb-2 border-b" style={{ color: "#fbbf24", borderColor: "rgba(251,191,36,0.2)" }}>
                📋 Indication
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "#f8fafc" }}>{remedy.usageInstructions}</p>
            </motion.div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
