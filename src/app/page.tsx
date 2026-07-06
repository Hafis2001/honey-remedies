import SearchInput from "@/components/SearchInput";
import * as motion from "framer-motion/client";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[80vh] py-12"
    >
      {/* Glowing 3D honey jar hero */}
      <motion.div
        animate={{ y: [0, -12, 0], rotateY: [0, 8, 0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative mb-8"
        style={{ perspective: "600px" }}
      >
        {/* Glow ring behind jar */}
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ background: "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)", transform: "scale(1.6) translateY(10px)" }}
        />
        <div className="relative text-9xl" style={{ filter: "drop-shadow(0 0 32px rgba(251,191,36,0.8)) drop-shadow(0 8px 24px rgba(217,119,6,0.6))" }}>
          🍯
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="font-playfair text-4xl md:text-6xl font-black text-center mb-4 leading-tight"
        style={{ background: "linear-gradient(135deg, #fbbf24 0%, #fef3c7 40%, #d97706 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
      >
        Find Your Natural Relief
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="text-center mb-10 text-lg max-w-lg"
        style={{ color: "#f8fafc" }}
      >
        Discover traditional honey-based remedies tailored for your specific ailments.
      </motion.p>

      {/* Search card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl glass-card glow-border rounded-2xl p-6 md:p-8"
      >
        <SearchInput />
      </motion.div>

      {/* Decorative floating hexagons (CSS) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{ left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -20, 0], rotate: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 5 + i * 0.8, delay: i * 0.6, ease: "easeInOut" }}
          >
            ⬡
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
