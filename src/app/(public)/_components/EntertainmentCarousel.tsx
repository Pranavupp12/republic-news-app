'use client';

import Link from "next/link";
import Image from "next/image";
import type { Article, User } from "@prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { format } from "date-fns-tz";
import { useState, useEffect } from "react"; // 1. Import hooks

interface EntertainmentCarouselProps {
  articles: (Article & { author: User | null })[];
}

export function EntertainmentCarousel({ articles }: EntertainmentCarouselProps) {
  // 2. STATE: Track if mounted
  const [isMounted, setIsMounted] = useState(false);

  // 3. EFFECT: Set mounted to true after first render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="w-full bg-white border-t border-b border-black py-8 my-0 lg:my-10 overflow-hidden">
      <div className="px-4">
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative group/carousel"
        >
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-medium font-heading text-black">
            The <span className="text-red-500">Buzz</span>
            </h2>

            <div className="flex gap-2">
               <CarouselPrevious className="static translate-y-0 bg-black hover:bg-red-600 text-white border-none h-10 w-10" />
               <CarouselNext className="static translate-y-0 bg-black hover:bg-red-600 text-white border-none h-10 w-10" />
            </div>
          </div>

          <CarouselContent className="-ml-4">
            {articles.map((article) => (
                <CarouselItem key={article.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <Link 
                    href={`/article/${article.slug}`} 
                    className="block group relative w-full aspect-[7/5] overflow-hidden border border-white/10"
                  >
                    <Image
                      src={article.imageUrl || "https://placehold.co/600x900"}
                      alt={article.title}
                      fill
                      sizes="(max-width: 768px) 90vw, 33vw"
                      className="object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

                    <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                      <h3 className="text-lg font-bold font-heading text-white leading-tight line-clamp-3 mb-3 group-hover:underline decoration-red-500 underline-offset-4 decoration-2">
                        {article.title}
                      </h3>

                      <div className="flex items-center text-xs text-slate-300 font-medium border-t border-white/20 pt-3">
                         {/* 4. FIX: Only render date if mounted */}
                         <span>
                           {isMounted 
                             ? format(new Date(article.createdAt), 'MMMM d, yyyy') 
                             : '...'}
                         </span>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}