import Link from "next/link";
import { HeaderNav } from "./_components/HeaderNav";
import { HeaderInfo } from "./_components/HeaderInfo";
import { SearchBar } from "./_components/SearchBar"; 
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input"; // <-- Import Input
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { MobileNav } from "./_components/MobileNav";

const categories = [
  { name: 'Technology', href: '/category/Technology' },
  { name: 'Travel', href: '/category/Travel' },
  { name: 'Sports', href: '/category/Sports' },
  { name: 'Business', href: '/category/Business' },
  { name: 'Culture', href: '/category/Culture' },
  { name: 'News', href: '/category/News' },
];

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background sticky top-0 z-50 border-b border-border/40">
        {/* TOP TIER HEADER */}
        <div className="container mx-auto px-4 grid grid-cols-3 items-center h-14">
          {/* Left Side: Show MobileNav on small, HeaderInfo on medium+ */}
          <div className="flex justify-start">
            <MobileNav /> {/* <-- ADD THE MOBILE NAV */}
            <HeaderInfo /> {/* This is already md:flex (hidden on mobile) */}
          </div>
          <div className="text-center">
            <Link href="/" className="text-md lg:text-3xl font-extrabold tracking-tight">
              <span className="text-red-500">Republic</span> News
            </Link>
          </div>
          <div className="flex justify-end">
            <SearchBar />
          </div>
        </div>

        {/* SEPARATOR LINE */}
        <div className="container mx-auto">
          <Separator />
        </div>

        {/* BOTTOM TIER HEADER (Navigation) */}
        <div className="hidden md:block">
          <div className=" container mx-auto px-4 flex items-center justify-center h-12">
            <HeaderNav />
          </div>
        </div>
      </header>

      <main className="flex-grow ">{children}</main>

        <footer className="bg-neutral-900 text-neutral-300">
        {/* CHANGE: Switched from lg:grid-cols-3 to lg:grid-cols-2 */}
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 lg:grid-cols-2 gap-7 md:gap-0 ">
          
          {/* Column 1: About & Social (Takes 1/2) */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className=" text-xl md:text-2xl font-bold font-heading text-white"><span className="text-red-500">Republic </span>News</h3>
            <p className=" text-xs md:text-sm text-neutral-400">
              Your daily source for the most important headlines and in-depth<br className="hidden md:block"/> 
              stories from technology and business to culture and sports.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="hover:text-red-500 transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-red-500 transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-red-500 transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-red-500 transition-colors"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Column 2: Links & Newsletter (Takes 1/2) */}
          <div className="lg:col-span-1">
            {/* This is the NESTED 3-column grid */}
            <div className="grid grid-cols-2 md:grid-cols-3">
              
              {/* Sub-Column 2a: Categories */}
              <div className="space-y-4">
                <h3 className=" text-xs md:text-sm font-semibold uppercase text-red-500">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.name}>
                      <Link href={cat.href} className="text-xs md:text-sm hover:text-red-500 transition-colors">
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sub-Column 2b: Policy */}
              <div className="space-y-4">
                <h3 className="text-xs md:text-sm font-semibold uppercase text-red-500">Policy</h3>
                <ul className="space-y-2">
                  <li><Link href="/public-sitemap" className="text-xs md:text-sm hover:text-red-500 transition-colors">Sitemap</Link></li>
                  {/*<li><Link href="/rss.xml" className="text-xs md:text-sm  hover:text-white transition-colors">RSS Feed</Link></li>*/}
                  <li><Link href="/terms-and-conditions" className="text-xs md:text-sm  hover:text-red-500 transition-colors">Terms & Conditions</Link></li>
                  <li><Link href="/privacy-policy" className="text-xs md:text-sm  hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>

              {/* Sub-Column 2c: Newsletter */}
              <div className="space-y-4 hidden md:block">
                <h3 className="text-sm font-semibold uppercase text-red-500">Subscribe to our Newsletter</h3>
                <p className="text-sm text-neutral-400">
                  Get the latest headlines and updates delivered straight to your inbox.
                </p>
                <form className="flex w-full max-w-sm items-center">
                  <Input 
                    type="email" 
                    placeholder="Email" 
                    className="bg-neutral-800 border-neutral-700 text-white" 
                  />
                  <Button type="submit" variant="default" className="hover:text-red-500">
                    Submit
                  </Button>
                </form>
              </div>

            </div>
          </div>
        </div>

        {/* --- BOTTOM DISCLAIMER (Unchanged) --- */}
        <div className="bg-black py-6 px-4">
          <div className="container mx-auto text-center text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} Republic News. All rights reserved.</p>
            <p className="mt-2">
              The material on this site may not be reproduced, distributed, transmitted, cached or
              otherwise used, except with the prior written permission of Republic News.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}