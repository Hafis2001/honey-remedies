import Link from "next/link";
import * as motion from "framer-motion/client";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex flex-col relative max-w-sm mx-auto"
      style={{ height: "calc(100dvh - 80px)" }}
    >
      {/* Main Image Area with Vision & Mission — grows but shrinks to make room for button */}
      <div className="relative flex-1 min-h-0 flex flex-col items-center justify-center overflow-y-auto py-6">
        
        {/* App Icon (Logo without the white card using mix-blend-mode) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1.5, 
            opacity: 1,
            y: [-5, 5, -5]
          }}
          transition={{ 
            opacity: { delay: 0.2, duration: 0.8, ease: "easeOut" },
            scale: { delay: 0.2, duration: 0.8, ease: "easeOut" },
            y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
          }}
          className="relative z-10 w-full max-w-[200px] mb-10 flex-shrink-0"
        >
          <img
            src="/images/logo_beecraft_transparent.png"
            alt="BeeCraft Logo"
            className="w-full h-auto object-contain mx-auto"
          />
        </motion.div>

        {/* Vision & Mission Quotes */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="w-full px-2 space-y-4 text-center flex-shrink-0"
        >
          {/* Vision */}
          <div>
            <h2 className="font-inter text-[10px] tracking-[0.2em] uppercase font-black mb-1.5 text-[#FF9D00]">Vision</h2>
            <p className="font-playfair text-lg italic font-medium leading-snug text-[#1A1A1A]">
              "Empowering healthy lives with pure, natural products."
            </p>
          </div>
          
          <div className="w-12 h-px bg-[#FF9D00]/30 mx-auto"></div>
          
          {/* Mission */}
          <div>
            <h2 className="font-inter text-[10px] tracking-[0.2em] uppercase font-black mb-1.5 text-[#FF9D00]">Mission</h2>
            <p className="text-xs font-inter font-medium leading-relaxed text-[#8E8E8E] max-w-[300px] mx-auto">
              To provide everyone with access to 100% quality natural honey, fostering awareness of its purity and health benefits. We offer a diverse range of honey products in various packagings, creating enriching experiences that celebrate nature's sweetness as a natural remedy.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Pagination dots — flex-shrink-0 so it never disappears */}
      <div className="flex-shrink-0 flex justify-center gap-1.5 py-3 z-10">
        <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
        <div className="w-6 h-2 rounded-full bg-[#FF9D00]"></div>
        <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
      </div>

      {/* CTA button with Bee — flex-shrink-0 so it is ALWAYS visible at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="flex-shrink-0 w-full z-10 px-2 pb-6 relative"
      >
        <div className="relative w-full">
          {/* Bee resting on the corner of the button */}
          <img
            src="/images/bee.png"
            alt="bee"
            className="absolute -top-6 -right-2 w-14 z-20 pointer-events-none opacity-90 drop-shadow-md"
          />
          <Link
            href="/search"
            className="btn-gold block w-full py-4 rounded-[24px] text-lg font-bold font-inter tracking-wide"
          >
            Taste Now
          </Link>
        </div>
      </motion.div>

    </motion.div>
  );
}

