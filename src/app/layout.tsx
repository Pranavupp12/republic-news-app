import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: {
    template: '%s | Republic News',
    default: 'Republic News - Your Source for US News',
  },
  description: 'Your daily source for breaking news and headlines from the United States.',
  keywords: ['us news', 'american news', 'republic news', 'headlines', 'politics'],
  robots: {
    index: false,
    follow: false, // Prevents following links as well
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
