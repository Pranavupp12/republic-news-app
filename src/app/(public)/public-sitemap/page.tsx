import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "An overview of all sections, categories, and pages on Republic News.",
};

export default async function SitemapPage() {
  // Fetch all unique categories from your articles
  const categories = await prisma.article.findMany({
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' }
  });

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
      
      {/* 4-column grid for all links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-8">
        
        {/* Column 1: Main Pages */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold font-heading border-b pb-2">Main Sections</h2>
          <ul className="space-y-2">
            {mainPages.map((page) => (
              <li key={page.name}>
                <Link href={page.href} className=" text-sm md:text-md text-muted-foreground hover:text-red-500">
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Categories */}
        <div className="space-y-4">
          <h2 className="text-lg md:text-xl font-semibold font-heading border-b pb-2">Categories</h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.category}>
                <Link href={`/category/${cat.category}`} className=" text-sm md:text-md text-muted-foreground hover:text-red-500">
                  {cat.category}
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
                <Link href={page.href} className=" text-sm md:text-md text-muted-foreground hover:text-red-500">
                  {page.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Other */}
        {/*<div className="space-y-4">
          <h2 className="text-xl font-semibold font-heading border-b pb-2">Other</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/rss.xml" className="text-muted-foreground hover:text-primary">
                RSS Feed
              </Link>
            </li>
          </ul>
        </div>*/}
        
      </div>
    </main>
  );
}