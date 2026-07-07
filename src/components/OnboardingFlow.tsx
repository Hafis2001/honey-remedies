"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  completed: boolean;
  gender: string;
  age: number;
  healthFlags: string[];
}

export default function OnboardingFlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(0); // 0: Welcome, 1: Gender, 2: Age, 3: Health, 4: Loading
  const [gender, setGender] = useState("");
  const [age, setAge] = useState<number>(30);
  const [healthFlags, setHealthFlags] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const profile = Cookies.get("honey_user_profile");
    if (!profile) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleComplete = () => {
    setStep(4);
    const profileData: UserProfile = {
      completed: true,
      gender,
      age,
      healthFlags,
    };
    Cookies.set("honey_user_profile", JSON.stringify(profileData), { expires: 365 });
    
    setTimeout(() => {
      setIsVisible(false);
      router.refresh();
    }, 1500);
  };

  const toggleFlag = (flag: string) => {
    if (flag === "None") {
      setHealthFlags(["None"]);
      return;
    }
    setHealthFlags(prev => {
      const filtered = prev.filter(f => f !== "None");
      return filtered.includes(flag) ? filtered.filter(f => f !== flag) : [...filtered, flag];
    });
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}
    >
      <div className="absolute top-8 left-0 w-full px-8">
        <div className="max-w-md mx-auto flex gap-2">
          {[1, 2, 3].map((idx) => (
            <div key={idx} className="h-1 flex-1 rounded-full transition-all duration-500"
              style={{ background: step >= idx ? "#fbbf24" : "rgba(251,191,36,0.15)" }} />
          ))}
        </div>
      </div>

      <div className="glass-card w-full max-w-md rounded-3xl overflow-hidden relative min-h-[400px] flex flex-col"
        style={{ border: "1px solid rgba(251,191,36,0.2)" }}
      >
        <AnimatePresence mode="wait">
          
          {step === 0 && (
            <motion.div
              key="step0"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8 text-center flex flex-col items-center justify-between h-full flex-1"
            >
              <div className="flex-1 flex flex-col items-center justify-center w-full">
                <motion.div 
                  animate={{ y: [0, -10, 0], filter: ["drop-shadow(0 0 16px rgba(251,191,36,0.4))", "drop-shadow(0 0 28px rgba(251,191,36,0.8))", "drop-shadow(0 0 16px rgba(251,191,36,0.4))"] }} 
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="text-[140px] mb-8"
                >
                  🍯
                </motion.div>
                
                <div className="w-full max-w-sm space-y-8 text-center">
                  <div>
                    <h2 className="font-inter text-[10px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: "#fbbf24" }}>Vision</h2>
                    <p className="font-playfair text-[22px] italic font-medium leading-relaxed" style={{ color: "#fef3c7" }}>
                      "Empowering healthy lives with pure, natural products."
                    </p>
                  </div>
                  
                  <div className="w-12 h-px bg-white/20 mx-auto"></div>

                  <div>
                    <h2 className="font-inter text-[10px] tracking-[0.2em] uppercase font-bold mb-3" style={{ color: "#fbbf24" }}>Mission</h2>
                    <p className="text-[13px] font-inter font-light leading-[1.8] opacity-90" style={{ color: "#f8fafc" }}>
                      To provide everyone with access to 100% quality natural honey, fostering awareness of its purity and health benefits. We offer a diverse range of honey products in various packagings, creating enriching experiences that celebrate nature's sweetness as a natural remedy.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(1)}
                className="btn-gold w-full py-4 mt-8 rounded-[20px] text-lg font-bold shadow-[0_4px_20px_rgba(251,191,36,0.3)] transition-all active:scale-95"
              >
                Get Started
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8 flex flex-col h-full flex-1"
            >
              <h2 className="font-playfair text-2xl font-bold mb-6" style={{ color: "#fef3c7" }}>Tell us a bit about you</h2>
              <div className="space-y-3 flex-1">
                {['Female', 'Male', 'Prefer not to say'].map((g) => (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    key={g}
                    onClick={() => { setGender(g.toLowerCase()); setStep(2); }}
                    className="w-full p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between"
                    style={gender === g.toLowerCase()
                      ? { borderColor: "#fbbf24", background: "rgba(251,191,36,0.12)", color: "#fef3c7" }
                      : { borderColor: "rgba(251,191,36,0.15)", background: "rgba(255,255,255,0.03)", color: "#f8fafc" }
                    }
                  >
                    <span className="font-medium">{g}</span>
                    {gender === g.toLowerCase() && <Check className="w-5 h-5" style={{ color: "#fbbf24" }} />}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8 flex flex-col h-full flex-1"
            >
              <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: "#fef3c7" }}>How old are you?</h2>
              <p className="text-sm mb-10" style={{ color: "#f8fafc" }}>We use this to ensure age-appropriate remedies.</p>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="font-playfair text-6xl font-black mb-6" style={{ color: "#fbbf24" }}>{age}</div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={age} 
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: "#fbbf24", background: "rgba(251,191,36,0.2)" }}
                />
              </div>

              <button 
                onClick={() => setStep(3)}
                className="btn-gold w-full py-3.5 mt-8 rounded-xl"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8 flex flex-col h-full flex-1"
            >
              <h2 className="font-playfair text-2xl font-bold mb-2" style={{ color: "#fef3c7" }}>Any health conditions?</h2>
              <p className="text-sm mb-6" style={{ color: "#f8fafc" }}>Select any that apply so we can filter unsafe remedies.</p>
              
              <div className="flex flex-wrap gap-2 flex-1">
                {['Diabetic', 'Pregnant', 'Breastfeeding', 'Honey allergy', 'None'].map((flag) => {
                  const isSelected = healthFlags.includes(flag);
                  return (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      key={flag}
                      onClick={() => toggleFlag(flag)}
                      className="px-4 py-2 rounded-full border-2 text-sm font-medium transition-all"
                      style={isSelected
                        ? { borderColor: "#fbbf24", background: "rgba(251,191,36,0.15)", color: "#fef3c7" }
                        : { borderColor: "rgba(255,255,255,0.1)", color: "#f8fafc" }
                      }
                    >
                      {flag}
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-8">
                <p className="text-xs text-center mb-4" style={{ color: "#854d0e" }}>Your info is only used to personalize honey recommendations and is kept strictly private.</p>
                <button 
                  onClick={handleComplete}
                  disabled={healthFlags.length === 0}
                  className="btn-gold w-full py-3.5 rounded-xl disabled:opacity-40"
                >
                  Complete Setup
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8 flex flex-col items-center justify-center h-full flex-1 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="w-16 h-16 rounded-full mb-6"
                style={{
                  border: "4px solid rgba(251,191,36,0.15)",
                  borderTopColor: "#fbbf24",
                }}
              />
              <h2 className="font-playfair text-xl font-bold" style={{ color: "#fef3c7" }}>Setting up your remedies...</h2>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
