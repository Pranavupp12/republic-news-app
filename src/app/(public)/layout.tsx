import Link from "next/link";
import Image from "next/image";
import { HeaderNav } from "./_components/HeaderNav";
import { HeaderInfo } from "./_components/HeaderInfo";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

// --- OPTIMIZATION START ---
import dynamic from 'next/dynamic';

// Lazy load the MobileNav. 
// We use ssr: true (default) so it's still in the HTML for SEO, 
// but the JavaScript bundle is split separate from the main thread.
const MobileNav = dynamic(() => 
  import("./_components/MobileNav").then((mod) => mod.MobileNav)
);

// Lazy load SearchBar as well if it has complex logic (hooks, state)
const SearchBar = dynamic(() => 
  import("./_components/SearchBar").then((mod) => mod.SearchBar)
);
// --- OPTIMIZATION END ---

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
        <div className="container mx-auto px-4 grid grid-cols-3 items-center h-14">
          
          <div className="flex justify-start">
            {/* The MobileNav code will now be in a separate chunk */}
            <MobileNav /> 
            <HeaderInfo /> 
          </div>

          <div className="flex justify-center items-center w-full">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo/rn-logo.png"
                alt="Republic News Logo" 
                width={222}
                height={39}
                priority={true}
                className="object-contain"
              />
            </Link>
          </div>

          <div className="flex justify-end">
            <SearchBar />
          </div>
        </div>

        <div className="container mx-auto">
          <Separator />
        </div>

        <div className="hidden md:block">
          <div className=" container mx-auto px-4 flex items-center justify-center h-12">
            <HeaderNav />
          </div>
        </div>
      </header>

      <main className="flex-grow ">{children}</main>

      <footer className="bg-neutral-900 text-neutral-300">
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 lg:grid-cols-2 gap-7 md:gap-0 ">
          <div className="lg:col-span-1 space-y-4">
            <h3 className=" text-xl md:text-2xl font-regular font-heading text-white"><span className="text-red-500">Republic </span>News</h3>
            <p className=" text-xs md:text-sm text-neutral-400">
              Your daily source for the most important headlines and in-depth<br className="hidden md:block" />
              stories from technology and business to culture and sports.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" className="hover:text-red-500 transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-red-500 transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-red-500 transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="hover:text-red-500 transition-colors"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="grid grid-cols-2 md:grid-cols-3">
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

              <div className="space-y-4">
                <h3 className="text-xs md:text-sm font-semibold uppercase text-red-500">Policy</h3>
                <ul className="space-y-2">
                  <li><Link href="/public-sitemap" className="text-xs md:text-sm hover:text-red-500 transition-colors">Sitemap</Link></li>
                  <li><Link href="/terms-and-conditions" className="text-xs md:text-sm  hover:text-red-500 transition-colors">Terms & Conditions</Link></li>
                  <li><Link href="/privacy-policy" className="text-xs md:text-sm  hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>

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

        <div className="bg-black py-6 px-4">
          <div className="container mx-auto text-center text-xs text-neutral-500">
            <p>© {new Date().getFullYear()} Republic News. All rights reserved.</p>
            <p className="mt-2">
              Disclaimer: Our website provides accurate and clear news. While we have Professional duties to keep
              our content accurate and helpful, we cannot guarantee that all information is always complete or up to
              date. We are not legally responsible for any issues, losses, or decisions that result from using the
              information on our site.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}