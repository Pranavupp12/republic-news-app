'use client';

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { FileText, ArrowRight, Loader2 } from "lucide-react";
import debounce from 'lodash.debounce';
import { formatDistanceToNow } from 'date-fns';

// --- Interfaces ---
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

// FIX: Updated type to allow functional updates like setOpen(prev => !prev)
interface SearchModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function SearchModal({ open, setOpen }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse>({ exact: [], related: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Reset query when modal closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults({ exact: [], related: [] });
    }
  }, [open]);

  // Keyboard Shortcut (Cmd+K) to open
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // This line caused the error before; now it's valid!
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults({ exact: [], related: [] });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data); 
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

        {/* GROUP 1: EXACT MATCHES */}
        {!loading && results.exact.length > 0 && (
          <CommandGroup heading="Top Results">
            {results.exact.map((article) => (
              <SearchResultItem key={article.slug} article={article} onSelect={handleSelect} getCategories={getCategories} />
            ))}
          </CommandGroup>
        )}

        {/* SEPARATOR */}
        {!loading && results.exact.length > 0 && results.related.length > 0 && (
          <div className="px-2 py-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>Read More</span>
              <div className="h-px bg-border flex-grow ml-2"></div>
            </div>
          </div>
        )}

        {/* GROUP 2: RELATED MATCHES */}
        {!loading && results.related.length > 0 && (
          <CommandGroup heading={results.exact.length === 0 ? "Results" : ""}>
            {results.related.map((article) => (
              <SearchResultItem key={article.slug} article={article} onSelect={handleSelect} getCategories={getCategories} />
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

// Helper Component for List Items
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