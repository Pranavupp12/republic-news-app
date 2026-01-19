'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, FileText, ArrowRight, Loader2, } from "lucide-react";
import { Button } from "@/components/ui/button";
import debounce from 'lodash.debounce';
import { formatDistanceToNow } from 'date-fns';

// Updated Interface for Split Results
interface SearchResponse {
  exact: ArticleResult[];
  related: ArticleResult[];
}

interface ArticleResult {
  slug: string;
  title: string;
  category: string[] | string;
  imageUrl: string | null;
  createdAt: string;
}

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // State now holds the split object
  const [results, setResults] = useState<SearchResponse>({ exact: [], related: [] });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Keyboard Shortcut (Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults({ exact: [], related: [] });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data); // Expecting { exact: [], related: [] }
    } catch (error) {
      console.error("Search failed", error);
      setResults({ exact: [], related: [] });
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((val: string) => performSearch(val), 400),
    []
  );

  const handleSelect = (slug: string) => {
    router.push(`/article/${slug}`);
    setOpen(false);
  };

  const getCategories = (cat: string | string[]) => {
    return Array.isArray(cat) ? cat : [cat];
  };

  const hasResults = results.exact.length > 0 || results.related.length > 0;

  return (
    <>
      <div className="flex items-center gap-2 w-auto">
        {/* 1. SEARCH BAR BUTTON (Visible on Medium & Up) */}
        {/* Changed 'hidden lg:block' -> 'hidden md:block' */}
        <Button
            variant="outline"
            // FIX 1: Added 'px-4' for better breathing room on sides
            // FIX 2: Added 'text-muted-foreground' to the parent so icon & text match perfectly
            className="relative h-10 w-full hidden md:flex items-center md:w-56 lg:w-64 justify-start bg-muted/50 border-muted hover:bg-background hover:text-foreground transition-all shadow-none px-4 text-muted-foreground"
            onClick={() => setOpen(true)}
        >
            {/* FIX 3: Removed 'opacity-50' so it matches the text color exactly. 
               Added 'translate-y-[0.5px]' to optically center it with the font baseline. */}
            <Search className="mr-2 h-4 w-4 shrink-0 translate-y-[0.5px]" />
            
            <span className="truncate text-sm font-normal">Search news...</span>
            
            <kbd className="pointer-events-none absolute right-2 top-2.5 hidden h-5 select-none items-center gap-1 text-[10px] font-medium opacity-100 sm:flex bg-muted border rounded px-1.5 text-muted-foreground">
                <span className="text-xs">⌘</span>K
            </kbd>
        </Button>

        {/* 2. SEARCH ICON BUTTON (Visible on Small Only) */}
        {/* Changed 'block lg:hidden' -> 'block md:hidden' */}
        <Button 
            variant="ghost"  // <--- THIS IS THE KEY CHANGE
            size="icon" 
            className="h-10 w-10 shrink-0 block md:hidden hover:bg-transparent" 
            onClick={() => setOpen(true)}
        >
            <Search className="h-5 w-5" /> {/* Increased icon size slightly for better visibility */}
        </Button>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput
          placeholder="Type title, topic, or category..."
          value={query}
          onValueChange={(val) => {
            setQuery(val);
            debouncedSearch(val);
          }}
        />
        <CommandList className="max-h-[600px]">

          {loading && (
            <div className="py-8 flex justify-center items-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-red-600" />
              Searching...
            </div>
          )}

          {!loading && query.length > 0 && !hasResults && (
            <CommandEmpty className="py-8 text-muted-foreground">
              No results found for <span className="font-bold text-black">"{query}"</span>.
            </CommandEmpty>
          )}

          {/* GROUP 1: EXACT MATCHES (Top Results) */}
          {!loading && results.exact.length > 0 && (
            <CommandGroup heading="Top Results">
              {results.exact.map((article) => (
                <SearchResultItem key={article.slug} article={article} onSelect={handleSelect} getCategories={getCategories} />
              ))}
            </CommandGroup>
          )}

          {/* SEPARATOR (Only if both exist) */}
          {!loading && results.exact.length > 0 && results.related.length > 0 && (
            <div className="px-2 py-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Read More</span>
                <div className="h-px bg-border flex-grow ml-2"></div>
              </div>
            </div>
          )}

          {/* GROUP 2: RELATED MATCHES (Read More) */}
          {!loading && results.related.length > 0 && (
            <CommandGroup heading={results.exact.length === 0 ? "Results" : ""}>
              {/* Note: We hide the heading if we already used the separator above to avoid double headers */}
              {results.related.map((article) => (
                <SearchResultItem key={article.slug} article={article} onSelect={handleSelect} getCategories={getCategories} />
              ))}
            </CommandGroup>
          )}

        </CommandList>
      </CommandDialog>
    </>
  );
}

// Sub-component for cleaner code
function SearchResultItem({ article, onSelect, getCategories }: any) {
  return (
    <CommandItem
      value={`${article.title}-${article.slug}`}
      onSelect={() => onSelect(article.slug)}
      className="flex items-start gap-4 p-3 cursor-pointer aria-selected:bg-accent group"
    >
      <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform group-aria-selected:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <FileText className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center min-w-0 flex-grow gap-1.5 py-1">
        <span className="text-sm font-semibold leading-tight line-clamp-2">
          {article.title}
        </span>
        <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider">
          <span className="font-bold text-red-600">
            {getCategories(article.category).map((cat: string, index: number, arr: string[]) => (
              <span key={cat}>
                {cat}
                {index < arr.length - 1 && <span className="text-gray-400 font-normal mx-1.5">•</span>}
              </span>
            ))}
          </span>
          <span className="text-muted-foreground/40 text-[10px]">•</span>
          <span className="flex items-center gap-1 text-muted-foreground font-medium">
            {article.createdAt ? formatDistanceToNow(new Date(article.createdAt), { addSuffix: true }) : ''}
          </span>
        </div>
      </div>
      <ArrowRight className="self-center h-4 w-4 text-muted-foreground opacity-0 group-aria-selected:opacity-100 transition-opacity" />
    </CommandItem>
  );
}