import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Phone, Flame, Clock, Star } from "lucide-react";
import { notFound } from "next/navigation";
import * as motion from "framer-motion/client";

// Helper to determine shop URL for each honey type
function getShopUrl(): string {
  // All products now go to the main product list page
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
      className="max-w-md md:max-w-2xl mx-auto pb-24"
    >
      {/* Custom Header for Details Page */}
      <div className="flex items-center justify-between mb-6 px-2">
        <Link href="/search" className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-inter font-bold text-lg text-gray-900">Remedy Details</h1>
        <div className="w-10 h-10"></div>
      </div>



      {/* Content Card */}
      <div className="bg-white rounded-[32px] p-6 shadow-[0_ -10px_40px_rgba(0,0,0,0.03)] mx-1">
        
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-inter text-2xl font-black text-gray-900 leading-tight pr-4">
            {remedy.title}
          </h2>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-[#FF9D00] text-[#FF9D00]" />
            <span className="text-sm font-bold text-gray-800">4.9</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium py-4 border-b border-gray-100 mb-6">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-[#FF9D00]" />
            <span>Natural</span>
          </div>
          <div className="w-px h-3 bg-gray-200"></div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>Fast Relief</span>
          </div>
          <div className="w-px h-3 bg-gray-200"></div>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#FF9D00]" />
            <span>Highly Rated</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* ── Ingredients ── */}
          <div>
            <h3 className="font-inter text-base font-bold text-gray-900 mb-3">Ingredients</h3>
            <ul className="space-y-2">
              {ingredients.map((ingredient: string, i: number) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 font-inter">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-[#FF9D00]" />
                  <span className="leading-relaxed">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Indication ── */}
          {remedy.usageInstructions && (
            <div>
              <h3 className="font-inter text-base font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-500 font-inter leading-relaxed">{remedy.usageInstructions}</p>
            </div>
          )}

          {/* ── Recommended Honey ── */}
          {remedy.honeyVarieties.length > 0 && (
            <div className="pt-2">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-inter text-base font-bold text-gray-900">Recommended</h3>
              </div>
              <div className="space-y-3">
                {remedy.honeyVarieties.map(({ honeyVariety }) => (
                  <div key={honeyVariety.id} className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <span className="font-bold text-sm text-gray-800">{honeyVariety.name}</span>
                    <span className="text-xs font-semibold text-[#FF9D00] bg-orange-50 px-3 py-1 rounded-full">Top Pick</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100 z-50">
        <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-center">
          <a
            href={getShopUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold w-full py-4 rounded-full text-lg font-bold relative overflow-hidden flex justify-center items-center"
          >
            <span className="relative z-10">Shop</span>
            {/* Small bee on button */}
            <img src="/images/bee.png" alt="bee" className="absolute right-4 top-1/2 -translate-y-1/2 w-8 z-10 pointer-events-none drop-shadow-sm" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
