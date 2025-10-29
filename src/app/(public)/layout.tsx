import Link from "next/link";
import { HeaderNav } from "./_components/HeaderNav";
import { HeaderInfo } from "./_components/HeaderInfo";
import { SearchBar } from "./_components/SearchBar"; 
import { Separator } from "@/components/ui/separator";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background sticky top-0 z-50 border-b border-border/40">
        {/* TOP TIER HEADER */}
        <div className="container mx-auto px-4 grid grid-cols-3 items-center h-16">
          {/* Left Side: Date and Weather */}
          <div className="flex justify-start">
            <HeaderInfo />
          </div>

          {/* Center: Title */}
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold tracking-tight">
              <span className="text-red-500">Republic</span> News
            </Link>
          </div>
          
          {/* Right Side: Empty Spacer to balance the layout */}
          <div className="flex justify-end">
           <SearchBar/>
          </div>
        </div>

        {/* SEPARATOR LINE */}
        <div className="container mx-auto">
          <Separator />
        </div>

        {/* BOTTOM TIER HEADER (Navigation) */}
        <div>
          <div className=" container mx-auto px-4 flex items-center justify-center h-12">
            <HeaderNav />
          </div>
        </div>
      </header>

      <main className="flex-grow ">{children}</main>

      <footer className="bg-red-500 border-t">
        <div className="container mx-auto  py-6 px-4 text-center text-lg text-white">
          © {new Date().getFullYear()} Republic News.
        </div>
      </footer>
    </div>
  );
}