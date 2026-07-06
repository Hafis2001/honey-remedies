import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import * as motion from "framer-motion/client";

export default function InfoPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 max-w-3xl mx-auto pt-8"
    >
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-80" style={{ color: "#d97706" }}>
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>

      <div className="glass-card rounded-3xl overflow-hidden p-8 space-y-8" style={{ background: "rgba(13, 5, 0, 0.8)", backdropFilter: "blur(12px)" }}>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-sm">
          <div className="flex-1 text-center md:text-left space-y-4">
            <img src="/images/logo_beecraft_white.png" alt="Beecraft Logo" className="w-24 h-24 object-contain mx-auto md:mx-0 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)] rounded-md" />
            <p style={{ color: "#f8fafc", lineHeight: "1.6" }} className="text-base">
              "At BeeCraft Museum, we warmly embrace the buzz for nature's guardianship. We partner with local groups to nurture the well-being of our essential friends, the bees."
            </p>
          </div>
          
          <div className="flex-1 flex flex-col items-center md:items-end gap-4 md:mt-4" style={{ color: "#f8fafc" }}>
            <div className="flex items-center gap-2 text-base">
              <strong style={{ color: "#fbbf24" }}>Location:</strong> Vythiri, Wayanad
            </div>
            <div className="flex items-center gap-2 text-base">
              <strong style={{ color: "#fbbf24" }}>Email:</strong> beecraftshoney@gmail.com
            </div>
            <div className="flex items-center gap-2 text-base">
              <strong style={{ color: "#fbbf24" }}>Phone:</strong> +91 92 0707 9001
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 text-sm pt-6 border-t border-amber-900/40" style={{ color: "#b45309" }}>
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} />
          <p>
            <strong style={{ color: "#fbbf24" }}>Disclaimer:</strong>{" "}
            This information is for general wellness purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Consult a doctor for serious or persistent symptoms. Honey should not be given to infants under 12 months of age.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
