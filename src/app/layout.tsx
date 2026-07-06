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
        {/* Background Image */}
        <div
          className="fixed inset-0 z-0 opacity-70"
          style={{
            backgroundImage: "url('/images/bg_honey_museum.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        {/* Dark overlay for readability */}
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(13,5,0,0.65) 0%, rgba(30,10,0,0.60) 50%, rgba(13,5,0,0.75) 100%)",
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
            <Link href="/info" className="flex items-center gap-3 group">
              <img src="/images/logo_beecraft_white.png" alt="Beecraft Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(251,191,36,0.5)] group-hover:scale-105 transition-transform rounded-sm" />
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


      </body>
    </html>
  );
}
