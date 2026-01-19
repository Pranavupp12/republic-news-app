import type { Metadata } from "next";
import { Inter } from "next/font/google"; // <-- 1. Import Heading Font
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "sonner";
import Script from "next/script";
import { Partytown } from '@builder.io/partytown/react';

// --- OPTIMIZE FONTS ---
const inter = Inter({
  subsets: ["latin"],
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
  manifest: '/manifest.json',
  keywords: ['us news', 'american news', 'republic news', 'headlines', 'politics'],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Partytown debug={true} forward={['dataLayer.push']} />
      </head>
      {/* 3. Add both font variables to the body */}
      <body className={`${inter}`}>
        <Script
          strategy="worker"
          src="https://www.googletagmanager.com/gtag/js?id=G-NQ8YSKL9YG"
        />
        <Script id="google-analytics" strategy="worker">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NQ8YSKL9YG');
          `}
        </Script>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}