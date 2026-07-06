import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Info } from "lucide-react";
import OnboardingFlow from "@/components/OnboardingFlow";
import HoneyScene from "@/components/HoneyScene";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1a0a00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Beecraft Remedies",
  description: "Find natural honey remedies for everyday ailments with Beecraft.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Beecraft Remedies",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased min-h-screen flex flex-col`}
        style={{ background: "#0d0500", color: "#fff5e4" }}
      >
        {/* 4K Background */}
        <div
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: "url('/honey_bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        {/* Dark overlay for readability */}
        <div
          className="fixed inset-0 z-0"
          style={{
            background: "linear-gradient(135deg, rgba(13,5,0,0.82) 0%, rgba(30,10,0,0.78) 50%, rgba(13,5,0,0.88) 100%)",
          }}
        />

        {/* 3D Canvas animation layer */}
        <HoneyScene />

        {/* Onboarding */}
        <OnboardingFlow />

        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-amber-900/30" style={{
          background: "rgba(13, 5, 0, 0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}>
          <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <span className="text-3xl drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] group-hover:scale-110 transition-transform">🍯</span>
              <span className="font-playfair text-xl font-bold tracking-wide" style={{ color: "#fbbf24" }}>
                Beecraft Remedies
              </span>
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-4 py-8 md:px-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-amber-900/30 py-6 px-4 mt-8"
          style={{ background: "rgba(13, 5, 0, 0.7)", backdropFilter: "blur(12px)" }}>
          <div className="max-w-5xl mx-auto flex gap-3 text-sm" style={{ color: "#b45309" }}>
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#d97706" }} />
            <p>
              <strong style={{ color: "#fbbf24" }}>Disclaimer:</strong>{" "}
              This information is for general wellness purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Consult a doctor for serious or persistent symptoms. Honey should not be given to infants under 12 months of age.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
