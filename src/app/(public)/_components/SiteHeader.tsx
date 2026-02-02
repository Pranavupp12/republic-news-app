'use client';

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
// 1. Import TextSearch here
import { TextSearch, X, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HeaderNav } from "./HeaderNav"; 
import { HeaderInfo } from "./HeaderInfo"; 
import { SearchModal } from "./SearchModal"; 
import { ARTICLE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  // Helper to trigger search from Sidebar
  const openSearchFromSidebar = () => {
    setIsSidebarOpen(false);
    // Small timeout to allow sidebar to close smoothly before modal opens
    setTimeout(() => setIsSearchOpen(true), 150);
  };

  return (
    <>
      {/* --- 1. SEARCH MODAL (Hidden by default) --- */}
      <SearchModal open={isSearchOpen} setOpen={setIsSearchOpen} />

      {/* --- 2. STICKY TOP BAR --- */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-0 h-16 grid grid-cols-3 items-center relative">
          
          {/* LEFT: Single TextSearch Icon */}
          <div className="flex justify-start items-center gap-4">
             
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors group"
              aria-label="Menu and Search"
            >
              {/* The Single Icon requested */}
              <TextSearch className="w-7 h-7 text-black hover:bg-gray-50" />
            </button>

          </div>

          {/* CENTER: Logo */}
          <div className="flex justify-center items-center">
            <Link href="/" onClick={closeSidebar}>
              <Image
                src="/logo/rn-logo.svg"
                alt="Republic News"
                width={220}
                height={45}
                className="object-contain"
                priority
                fetchPriority="high"
              />
            </Link>
          </div>

          {/* RIGHT: Date & Weather */}
          <div className="flex justify-end items-center">
             <div className="hidden lg:block opacity-80 scale-90 origin-right">
                <HeaderInfo />
             </div>
          </div>
        </div>
      </header>

      {/* --- 3. NAVIGATION RIBBON (Desktop) --- */}
      <div className="hidden md:block border-b border-gray-100 bg-white">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-12">
            <HeaderNav />
          </div>
        </div>
      </div>

      {/* --- 4. SIDEBAR DRAWER --- */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={closeSidebar}
      />

      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-full md:w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b">
           <span className="font-bold text-lg">Menu</span>
           <Button variant="ghost" size="icon" onClick={closeSidebar}>
             <X className="h-6 w-6" />
           </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Search Input Trigger */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Search</h3>
                <div className="relative group cursor-pointer" onClick={openSearchFromSidebar}>
                   <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-muted-foreground" />
                   </div>
                   {/* This is a visual dummy input. Clicking ANYWHERE on it triggers the real modal above. */}
                   <Input 
                     readOnly 
                     placeholder="Search news, topics..." 
                     className="bg-gray-50 border-gray-200 pl-9 cursor-pointer hover:bg-gray-100 focus-visible:ring-0"
                   />
                </div>
            </div>

            {/* Links */}
            <nav className="space-y-1">
               <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Sections</h3>
               
               <Link 
                  href="/" 
                  onClick={closeSidebar}
                  className="flex items-center justify-between py-3 border-b border-gray-100 text-lg font-bold hover:text-red-600 group"
                >
                  Home
                  <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-red-600" />
               </Link>

               {ARTICLE_CATEGORIES.map((category) => (
                 <Link 
                   key={category} 
                   href={`/category/${category}`}
                   onClick={closeSidebar}
                   className="flex items-center justify-between py-3 border-b border-gray-100 text-lg font-medium text-gray-800 hover:text-red-600 group"
                 >
                   {category}
                   <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-red-600" />
                 </Link>
               ))}
            </nav>

            <div className="pt-4 space-y-2">
               <Link href="/privacy-policy" onClick={closeSidebar} className="block text-sm text-gray-500 hover:underline">Privacy Policy</Link>
               <Link href="/terms-and-conditions" onClick={closeSidebar} className="block text-sm text-gray-500 hover:underline">Terms & Conditions</Link>
            </div>
        </div>
      </div>
    </>
  );
}