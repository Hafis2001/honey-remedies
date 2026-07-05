import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { UserProfile } from "@/components/OnboardingFlow";
import * as motion from "framer-motion/client";

export default async function RemedyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const remedy = await prisma.remedy.findUnique({
    where: { id },
    include: { honeyVarieties: { include: { honeyVariety: true } } },
  });
  if (!remedy) notFound();

  const cookieStore = await cookies();
  const profileCookie = cookieStore.get("honey_user_profile");
  const profile: UserProfile | null = profileCookie ? JSON.parse(profileCookie.value) : null;

  const isDiabeticWarning = profile?.healthFlags.includes('Diabetic') && !remedy.isDiabeticSafe;
  const isPregnancyWarning = (profile?.healthFlags.includes('Pregnant') || profile?.healthFlags.includes('Breastfeeding')) && !remedy.isPregnancySafe;
  const isPersonalized = remedy.targetGender === profile?.gender;

  const ingredients = JSON.parse(remedy.ingredients);
  const steps = JSON.parse(remedy.steps);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-5 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link href="/search" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80" style={{ color: "#d97706" }}>
          <ArrowLeft className="w-4 h-4" /> Back to search
        </Link>
        {profile && (
          <Link href="/" className="text-xs hover:underline" style={{ color: "#854d0e" }}>
            Not accurate? Update profile
          </Link>
        )}
      </div>

      {(isDiabeticWarning || isPregnancyWarning) && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="rounded-xl p-4 flex gap-3" style={{ background: "rgba(120, 53, 15, 0.3)", border: "1px solid rgba(217,119,6,0.4)" }}>
          <ShieldAlert className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#fbbf24" }} />
          <div>
            <p className="font-bold mb-1" style={{ color: "#fcd34d" }}>Personalized Health Caution</p>
            {isDiabeticWarning && <p className="text-sm" style={{ color: "#d97706" }}>High-sugar honey. As a diabetic, consult your doctor before use.</p>}
            {isPregnancyWarning && <p className="text-sm" style={{ color: "#d97706" }}>Not confirmed safe for pregnancy/breastfeeding. Consult your healthcare provider.</p>}
          </div>
        </motion.div>
      )}

      {isPersonalized && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
          className="rounded-xl p-3 flex gap-2 items-center" style={{ background: "rgba(217,119,6,0.12)", border: "1px solid rgba(251,191,36,0.2)" }}>
          <Sparkles className="w-4 h-4" style={{ color: "#fbbf24" }} />
          <p className="text-sm font-medium" style={{ color: "#fcd34d" }}>Personalized for you based on your profile</p>
        </motion.div>
      )}

      {/* Main card */}
      <div className="glass-card rounded-3xl overflow-hidden">
        {/* Hero title area */}
        <div className="p-8 border-b border-amber-900/30" style={{ background: "linear-gradient(135deg, rgba(120,53,15,0.3) 0%, rgba(20,8,0,0.2) 100%)" }}>
          <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-playfair text-3xl md:text-4xl font-black mb-3" style={{ color: "#fef3c7" }}>
            {remedy.title}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-base" style={{ color: "#c4956a" }}>
            {remedy.description}
          </motion.p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* Honey Varieties */}
          {remedy.honeyVarieties.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-playfair text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: "#fbbf24" }}>
                🍯 Recommended Honey Varieties
              </h2>
              <div className="space-y-3">
                {remedy.honeyVarieties.map(({ honeyVariety }) => (
                  <div key={honeyVariety.id} className="rounded-xl p-4" style={{ background: "rgba(120,53,15,0.2)", border: "1px solid rgba(251,191,36,0.15)" }}>
                    <h3 className="font-bold text-lg mb-1" style={{ color: "#fef3c7" }}>{honeyVariety.name}</h3>
                    <p className="text-sm mb-3" style={{ color: "#c4956a" }}>{honeyVariety.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {JSON.parse(honeyVariety.keyProperties).map((prop: string) => (
                        <span key={prop} className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: "rgba(217,119,6,0.2)", color: "#fcd34d", border: "1px solid rgba(251,191,36,0.2)" }}>
                          {prop}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Ingredients & Steps */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-playfair text-xl font-bold mb-4 pb-2 border-b" style={{ color: "#fbbf24", borderColor: "rgba(251,191,36,0.15)" }}>
                Ingredients
              </h2>
              <ul className="space-y-3">
                {ingredients.map((ingredient: string, i: number) => (
                  <li key={i} className="flex items-start gap-3" style={{ color: "#c4956a" }}>
                    <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#d97706" }} />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold mb-4 pb-2 border-b" style={{ color: "#fbbf24", borderColor: "rgba(251,191,36,0.15)" }}>
                Preparation
              </h2>
              <ol className="space-y-4">
                {steps.map((step: string, i: number) => (
                  <li key={i} className="flex gap-3" style={{ color: "#c4956a" }}>
                    <span className="font-bold w-6 flex-shrink-0" style={{ color: "#d97706" }}>{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>

          {/* Usage & Safety */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-4">
            <div className="rounded-xl p-4" style={{ background: "rgba(30,58,138,0.2)", border: "1px solid rgba(59,130,246,0.2)" }}>
              <h3 className="font-bold mb-2" style={{ color: "#93c5fd" }}>Usage Instructions</h3>
              <p style={{ color: "#bfdbfe" }}>{remedy.usageInstructions}</p>
            </div>

            <motion.div
              animate={{ boxShadow: ["0 0 0 0 rgba(239,68,68,0)", "0 0 0 6px rgba(239,68,68,0.07)", "0 0 0 0 rgba(239,68,68,0)"] }}
              transition={{ delay: 0.8, duration: 2.5, repeat: 2 }}
              className="rounded-xl p-4 flex gap-3" style={{ background: "rgba(127,29,29,0.2)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#f87171" }} />
              <div>
                <h3 className="font-bold mb-1" style={{ color: "#fca5a5" }}>Safety Notes</h3>
                <p style={{ color: "#fca5a5" }}>{remedy.safetyNotes}</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
