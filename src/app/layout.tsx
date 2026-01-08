import type { Metadata } from "next";
import { Inter, Calistoga } from "next/font/google"; // <-- 1. Import Heading Font
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "sonner";
import Script from 'next/script';

// --- OPTIMIZE FONTS ---
const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // <-- 2. Fixes "Element Render Delay" (Flash of invisible text)
  variable: '--font-inter', // Enables use with Tailwind
});

const calistoga = Calistoga({
  weight: '400',
  subsets: ["latin"],
  display: 'swap', // <-- 2. Fixes "Element Render Delay" for headlines
  variable: '--font-heading', // Matches your "font-heading" class
});

export const metadata: Metadata = {

  // 1. Base URL for all metadata URLs
  metadataBase: new URL('https://www.republicnews.us'),

  // 2. This magic line tells Next.js: 
  // "For every page, the canonical URL is the current path."
  alternates: {
    canonical: './',
  },

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
      <body className={`${inter.variable} ${calistoga.variable} font-sans antialiased`}>
        <AuthProvider>
          {children}
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key="jr+qzSezxs+S6zg7KtOZrQ"
            strategy="afterInteractive"
          />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}