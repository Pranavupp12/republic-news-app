import Link from "next/link";
import { Metadata } from "next";
import { ARTICLE_CATEGORIES } from "@/lib/constants"; // Import your single source of truth

export const metadata: Metadata = {
  title: "Sitemap",
  description: "An overview of all sections, categories, and pages on Republic News.",
};

export default function SitemapPage() {
  // Define your main static pages
  const mainPages = [
    { name: "Home", href: "/" },
    { name: "Web Stories", href: "/web-stories" },
  ];

  // Define your legal/policy pages
  const legalPages = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
  ];

  return (
    <main className="container mx-auto py-10 px-10 md:px-4 max-w-5xl">
      <h1 className="text-2xl md:text-4xl font-bold font-heading mb-12 text-center">Sitemap</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-8">
        
        {/* Column 1: Main Pages */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold font-heading border-b pb-2">Main Sections</h2>
          <ul className="space-y-2">
            {mainPages.map((page) => (
              <li key={page.name}>
                <Link href={page.href} className="text-sm md:text-md text-muted-foreground hover:text-red-500">
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Categories (Now using your constants) */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold font-heading border-b pb-2">Categories</h2>
          <ul className="space-y-2">
            {ARTICLE_CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link href={`/category/${cat}`} className="text-sm md:text-md text-muted-foreground hover:text-red-500">
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold font-heading border-b pb-2">Legal</h2>
          <ul className="space-y-2">
            {legalPages.map((page) => (
              <li key={page.name}>
                <Link href={page.href} className="text-sm md:text-md text-muted-foreground hover:text-red-500">
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
      </div>
    </main>
  );
}