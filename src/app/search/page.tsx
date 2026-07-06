import { prisma } from "@/lib/prisma";
import Fuse from "fuse.js";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle } from "lucide-react";
import SearchInput from "@/components/SearchInput";
import { cookies } from "next/headers";
import { UserProfile } from "@/components/OnboardingFlow";
import * as motion from "framer-motion/client";

export const dynamic = 'force-dynamic';

async function getSearchResults(query: string, profile: UserProfile | null) {
  const allRemedies = await prisma.remedy.findMany({
    include: {
      honeyVarieties: { include: { honeyVariety: true } },
    },
  });

  let safeRemedies = allRemedies;
  if (profile) {
    safeRemedies = allRemedies.filter(remedy => profile.age >= remedy.minimumAge);
  }

  let results = safeRemedies;

  if (query) {
    const fuse = new Fuse(safeRemedies, {
      keys: ["title", "ailmentTags", "description", "honeyVarieties.honeyVariety.name", "honeyVarieties.honeyVariety.bestForTags"],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
    });
    results = fuse.search(query).sort((a, b) => (a.score || 0) - (b.score || 0)).map(r => r.item);
  }

  if (profile) {
    results = results.map(remedy => {
      let score = 0;
      let reason: string | null = null;
      if (profile.healthFlags.includes('Diabetic') && !remedy.isDiabeticSafe) score -= 10;
      if ((profile.healthFlags.includes('Pregnant') || profile.healthFlags.includes('Breastfeeding')) && !remedy.isPregnancySafe) score -= 10;
      if (remedy.targetGender === profile.gender) { score += 5; reason = "Recommended for your profile"; }
      return { ...remedy, _pScore: score, _pReason: reason };
    }).sort((a: any, b: any) => b._pScore - a._pScore);
  }

  return results;
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q || "";
  const cookieStore = await cookies();
  const profileCookie = cookieStore.get("honey_user_profile");
  const profile: UserProfile | null = profileCookie ? JSON.parse(profileCookie.value) : null;
  const remedies = await getSearchResults(query, profile);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80 transition-opacity" style={{ color: "#d97706" }}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        {profile && (
          <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1.5" style={{ background: "rgba(217,119,6,0.15)", border: "1px solid rgba(251,191,36,0.25)", color: "#fcd34d" }}>
            <Sparkles className="w-3 h-3" /> Personalized for you
          </span>
        )}
      </div>

      <div className="glass-card rounded-2xl p-5">
        <SearchInput />
      </div>

      <div>
        <h1 className="font-playfair text-3xl font-bold mb-6" style={{ color: "#fbbf24" }}>
          {query ? `Results for "${query}"` : "All Remedies"}
        </h1>

        {remedies.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4 gold-glow">🍯</div>
            <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: "#fbbf24" }}>No matches found</h2>
            <p style={{ color: "#c4956a" }}>Try "cough", "sore throat", or "indigestion".</p>
          </div>
        ) : (
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
            className="grid gap-4"
          >
            {remedies.map((remedy: any) => {
              // Helper to determine shop URL
              const honeyNames = remedy.honeyVarieties.map((hv: any) => hv.honeyVariety.name).join(", ");
              let shopUrl = "https://www.beecrafthoney.com/";
              if (honeyNames.toLowerCase().includes("black forest")) {
                shopUrl = "https://www.beecrafthoney.com/product/Honey/1/3/101/Black-Forest-Honey---500gm-3";
              }

              return (
                <motion.div
                  key={remedy.id}
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.015, y: -2 }}
                >
                  <div className={`glass-card glass-card-hover rounded-2xl p-5 transition-all flex flex-col h-full ${remedy._pScore < 0 ? 'border-red-900/40' : ''}`}>
                    <Link href={`/remedy/${remedy.id}`} className="block flex-1 mb-4">
                      <div className="flex justify-between items-start gap-3 mb-2">
                        <h3 className="font-playfair text-xl font-bold" style={{ color: "#fef3c7" }}>{remedy.title}</h3>
                        <div className="flex gap-2 flex-shrink-0">
                          {remedy._pReason && (
                            <span className="text-xs px-2 py-1 rounded flex items-center gap-1" style={{ background: "rgba(217,119,6,0.2)", color: "#fcd34d" }}>
                              <Sparkles className="w-3 h-3" /> {remedy._pReason}
                            </span>
                          )}
                          {remedy._pScore < 0 && (
                            <span className="text-xs px-2 py-1 rounded flex items-center gap-1" style={{ background: "rgba(185,28,28,0.2)", color: "#f87171" }}>
                              <AlertCircle className="w-3 h-3" /> Caution
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-sm mb-4 line-clamp-2" style={{ color: "#c4956a" }}>{remedy.description}</p>

                      {remedy.honeyVarieties.length > 0 && (
                        <div className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg" style={{ background: "rgba(217,119,6,0.12)", border: "1px solid rgba(251,191,36,0.15)" }}>
                          <span className="text-base">🍯</span>
                          <span style={{ color: "#d97706" }}>Recommended:</span>
                          <span className="font-bold" style={{ color: "#fbbf24" }}>
                            {honeyNames}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mt-3">
                        {JSON.parse(remedy.ailmentTags).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 rounded-full text-xs" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#92400e" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                    
                    <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: "rgba(251,191,36,0.1)" }}>
                      <Link href={`/remedy/${remedy.id}`} className="flex-1 text-center py-2 rounded-lg text-sm font-semibold transition-colors" style={{ background: "rgba(255,255,255,0.05)", color: "#fbbf24" }}>
                        View Details
                      </Link>
                      <a href={shopUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2 rounded-lg text-sm font-semibold btn-gold text-amber-950">
                        Shop Honey
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
