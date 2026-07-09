import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Info, Bell } from "lucide-react";
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
  themeColor: "#FFF8E6",
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
        className={`${playfair.variable} ${inter.variable} antialiased min-h-screen h-screen flex flex-col`}
      >
        {/* 3D Canvas animation layer */}
        <HoneyScene />

        {/* Header - Profile and Notification style from images */}
        <header className="sticky top-0 z-30 pt-6 pb-2 bg-transparent">
          <div className="max-w-md md:max-w-3xl mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-full bg-white shadow-sm overflow-hidden p-1 flex items-center justify-center">
                <img src="/images/logo_beecraft_white.png" alt="Profile" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-inter mb-0.5">Welcome Back</p>
                <p className="text-gray-900 font-bold text-sm md:text-base font-inter">Beecraft User</p>
              </div>
            </Link>
            
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 flex-1 w-full max-w-md md:max-w-3xl mx-auto px-4 py-4 md:px-6">
          {children}
        </main>

      </body>
    </html>
  );
}
