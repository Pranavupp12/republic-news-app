import type { Metadata } from "next";
import { Inter } from "next/font/google"; // <-- 1. Import Heading Font
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "sonner";

// --- OPTIMIZE FONTS ---
const inter = Inter({ 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Republic News',
    default: 'Republic News - Your Source for US News',
  },
  description: 'Your daily source for breaking news and headlines from the United States.',
  keywords: ['us news', 'american news', 'republic news', 'headlines', 'politics'],
  robots: {
    index: false,
    follow: false, 
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* 3. Add both font variables to the body */}
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
    </html>
  );
}