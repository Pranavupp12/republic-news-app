import Link from "next/link";
import Image from "next/image";
import { HeaderNav } from "./_components/HeaderNav";
import { HeaderInfo } from "./_components/HeaderInfo";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { SearchBar } from "./_components/SearchBar";
import { NotificationModal } from "./_components/NotificationModal";

// --- FIX: Import the new wrapper component instead of using dynamic() here ---
import DynamicMobileNav from "./_components/DynamicMobileNav";

import { ARTICLE_CATEGORIES } from "@/lib/constants";


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">

      {/*/ --- FIX: Add NotificationModal at the top level of the layout --- */}
      <NotificationModal />
      
      <header className="bg-background sticky top-0 z-50 border-b border-border/40">
        <div className="container mx-auto px-8 lg:px-0 grid grid-cols-3 items-center h-18">

          <div className="flex justify-start">
            {/* Use the new wrapper component here */}
            <DynamicMobileNav />
            <HeaderInfo />
          </div>

          <div className="flex justify-center items-center w-full">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/rn-logo.svg"
                alt="Republic News Logo"
                width={250}
                height={50}
                priority={true}
                className="object-contain"
              />
            </Link>
          </div>

          <div className="flex justify-end">
            <SearchBar />
          </div>
        </div>

        {/* ... Rest of the file remains exactly the same ... */}
        <div className="container mx-auto">
          <Separator />
        </div>

        <div className="hidden md:block">
          <div className=" container mx-auto  flex items-center justify-center h-16">
            <HeaderNav />
          </div>
        </div>
      </header>

      <main className="flex-grow ">{children}</main>

      <footer className="bg-neutral-900 text-neutral-300">
        <div className="container mx-auto px-4 py-4 lg:py-12 grid grid-cols-2 lg:grid-cols-2 gap-7 md:gap-0 ">
          <div className="lg:col-span-1 space-y-4">
            <h3 className=" text-xl md:text-2xl font-regular font-heading text-white"><span className="text-red-500">Republic </span>News</h3>
            <p className=" text-xs md:text-sm text-white">
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
                  {/* 2. UPDATE THE MAPPING LOGIC */}
                  {ARTICLE_CATEGORIES.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/category/${category}`}
                        className="text-xs md:text-sm hover:text-red-500 transition-colors"
                      >
                        {category}
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
                <p className="text-sm text-white">
                  Get the latest headlines and updates delivered straight to your inbox.
                </p>
                <form className="flex w-full max-w-sm items-center">
                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-white text-black"
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
          <div className="container mx-auto text-center text-xs text-white">
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