import Link from "next/link";
import * as motion from "framer-motion/client";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="flex flex-col min-h-[85vh] relative max-w-sm mx-auto overflow-hidden"
    >
      {/* Title & Subtitle */}
      <div className="z-10 mb-2 mt-4 px-2">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-inter text-[32px] md:text-4xl font-black text-[#1A1A1A] leading-[1.1] mb-2"
        >
          Natural Honey,<br />Just a Tap Away.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-[#8E8E8E] text-sm font-medium font-inter"
        >
          Fresh, tasty honey at great prices.
        </motion.p>
      </div>

      {/* Main Image Area with Floating Badges */}
      <div className="relative flex-1 flex items-center justify-center min-h-[420px]">
        {/* Badges - Animated one by one */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: [0, -8, 0] }}
          transition={{ 
            opacity: { delay: 0.5, duration: 0.4 },
            scale: { delay: 0.5, duration: 0.4, type: "spring" },
            x: { delay: 0.5, duration: 0.4 },
            y: { repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.9 }
          }}
          className="absolute top-2 right-12 bg-white rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.04)] px-5 py-3 text-center z-20"
        >
          <div className="text-[#8E8E8E] text-xs font-semibold mb-0.5">Quality</div>
          <div className="text-[#1A1A1A] font-black text-sm"><span className="text-[17px]">100%</span> <span className="text-[#8E8E8E] font-medium text-xs">Pure</span></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: [0, 8, 0] }}
          transition={{ 
            opacity: { delay: 0.8, duration: 0.4 },
            scale: { delay: 0.8, duration: 0.4, type: "spring" },
            x: { delay: 0.8, duration: 0.4 },
            y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.2 }
          }}
          className="absolute top-24 left-2 bg-white rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.04)] px-5 py-3 text-center z-20"
        >
          <div className="text-[#8E8E8E] text-xs font-semibold mb-0.5">Type</div>
          <div className="text-[#1A1A1A] font-black text-sm"><span className="text-[17px]">Raw</span> <span className="text-[#8E8E8E] font-medium text-xs">Honey</span></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{ 
            opacity: { delay: 1.1, duration: 0.4 },
            scale: { delay: 1.1, duration: 0.4, type: "spring" },
            y: { repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1.5 }
          }}
          className="absolute bottom-28 right-4 bg-white rounded-[20px] shadow-[0_10px_25px_rgba(0,0,0,0.04)] px-5 py-3 text-center z-20"
        >
          <div className="text-[#8E8E8E] text-xs font-semibold mb-0.5">Additive</div>
          <div className="text-[#1A1A1A] font-black text-sm"><span className="text-[17px]">0%</span> <span className="text-[#8E8E8E] font-medium text-xs">Sugar</span></div>
        </motion.div>



        {/* Honey Jar - 3D Floating Animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [-12, 12, -12],
            rotateY: [-8, 8, -8],
            rotateX: [3, -3, 3]
          }}
          transition={{ 
            opacity: { delay: 0.4, duration: 0.8, ease: "easeOut" },
            scale: { delay: 0.4, duration: 0.8, ease: "easeOut" },
            y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
            rotateY: { repeat: Infinity, duration: 5, ease: "easeInOut" },
            rotateX: { repeat: Infinity, duration: 4.5, ease: "easeInOut" }
          }}
          className="relative z-10 w-full max-w-[280px] perspective-[1000px]"
        >
          <img
            src="/images/logo_beecraft_white.png"
            alt="BeeCraft Logo"
            className="w-full max-w-[200px] h-auto object-contain drop-shadow-2xl mx-auto"
          />
        </motion.div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-1.5 my-6 z-10">
        <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
        <div className="w-6 h-2 rounded-full bg-[#FF9D00]"></div>
        <div className="w-2 h-2 rounded-full bg-white opacity-60"></div>
      </div>

      {/* CTA button with Bee */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="w-full z-10 px-2 mt-2 pb-6 relative"
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
