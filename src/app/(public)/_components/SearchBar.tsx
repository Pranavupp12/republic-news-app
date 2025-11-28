'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import debounce from 'lodash.debounce';

interface ArticleSearchResult {
    slug: string;
    title: string;
    category: string;
}

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ArticleSearchResult[]>([]);
  const router = useRouter();

  // Add keyboard shortcut (Cmd+K or Ctrl+K) to open the search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const fetchResults = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length > 1) {
        const response = await fetch(`/api/search?query=${searchQuery}`);
        const data = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchResults(query);
  }, [query, fetchResults]);
  
  // THE FIX: Function now accepts a 'slug' and navigates to the correct URL
  const handleSelect = (slug: string) => {
    router.push(`/article/${slug}`);
    setOpen(false);
  };

  return (
    <>
      {/* IMPROVED TRIGGER BUTTON */}
      <Button
        variant="outline"
        className="relative h-9 w-12 justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12  md:w-40 lg:w-60"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        <span className="hidden md:inline-flex">Search articles...</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="search for news articles"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Articles">
              {results.map((article) => (
                <CommandItem
                  key={article.slug}
                  onSelect={() => handleSelect(article.slug)}
                  value={article.title}
                >
                  {article.title}
                  <span className="ml-auto text-xs text-muted-foreground">{article.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}