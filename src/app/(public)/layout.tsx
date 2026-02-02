import Link from "next/link";
import { SiteHeader } from "./_components/SiteHeader"; // The only header import needed
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from "lucide-react"; 
import { NotificationModal } from "./_components/NotificationModal";
import { ARTICLE_CATEGORIES } from "@/lib/constants";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      
      <NotificationModal />
      
      {/* New Unified Header */}
      <SiteHeader />

      <main className="flex-grow">{children}</main>

      <footer className="bg-neutral-900 text-neutral-300">
        <div className="container mx-auto px-4 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl md:text-2xl font-regular font-heading text-white">
              <span className="text-red-500">Republic </span>News
            </h3>
            <p className="text-sm text-white max-w-sm">
              Your daily source for the most important headlines and in-depth stories from technology and business to culture and sports.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link href="#" aria-label="find us on facebook" className="hover:text-red-500 transition-colors"><Facebook className="h-5 w-5" /></Link>
              <Link href="#" aria-label="find us on twitter" className="hover:text-red-500 transition-colors"><Twitter className="h-5 w-5" /></Link>
              <Link href="#" aria-label="find us on instagram" className="hover:text-red-500 transition-colors"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" aria-label="find us on linkedin" className="hover:text-red-500 transition-colors"><Linkedin className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase text-red-500">Categories</h3>
                <ul className="space-y-2">
                  {ARTICLE_CATEGORIES.map((category) => (
                    <li key={category}>
                      <Link
                        href={`/category/${category}`}
                        className="text-sm hover:text-red-500 transition-colors"
                        aria-label={`Read more about ${category}`}
                      >
                        {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-semibold uppercase text-red-500">Policy</h3>
                <ul className="space-y-2">
                  <li><Link href="/public-sitemap" aria-label="Read more about Sitemap" className="text-sm hover:text-red-500 transition-colors">Sitemap</Link></li>
                  <li><Link href="/terms-and-conditions" aria-label="Read more about Terms & Conditions" className="text-sm  hover:text-red-500 transition-colors">Terms & Conditions</Link></li>
                  <li><Link href="/privacy-policy" aria-label="Read more about Privacy Policy" className="text-sm  hover:text-red-500 transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>

              <div className="space-y-4 hidden sm:block">
                <h3 className="text-sm font-semibold uppercase text-red-500">Subscribe</h3>
                <p className="text-sm text-white">
                  Get the latest headlines delivered straight to your inbox.
                </p>
                <form className="relative w-full max-w-sm">
                  <Input
                    type="email"
                    placeholder="Email address"
                    className="bg-white text-black pr-12 h-10 rounded-md border-none focus-visible:ring-red-500"
                  />
                  <Button 
                    type="submit" 
                    size="sm"
                    className="absolute right-1 top-1 h-8 bg-red-600 hover:bg-red-700 hover:text-white text-white px-3 rounded"
                    aria-label="submit email"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              </div>

            </div>
          </div>
        </div>

        <div className="bg-black py-6 px-4">
          <div className="container mx-auto text-center text-xs text-white">
            <p>© {new Date().getFullYear()} Republic News. All rights reserved.</p>
            <p className="mt-2 max-w-4xl mx-auto leading-relaxed text-neutral-400">
              Disclaimer: Our website provides accurate and clear news. While we have professional duties to keep
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