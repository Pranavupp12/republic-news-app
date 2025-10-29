'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
  baseUrl?: string;
  scrollTargetId?: string;
  pageParamName?: string;
}

export function PaginationControls({ totalPages, currentPage, baseUrl = '/', scrollTargetId, pageParamName='page' }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // The handler now accepts the click event
  const handleNavigation = (e: React.MouseEvent, pageNumber: number) => {
    //  PREVENT THE DEFAULT BROWSER JUMP
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams);
    params.set(pageParamName, pageNumber.toString());
    
    router.push(`${baseUrl}?${params.toString()}`, { scroll: false });

    if (scrollTargetId) {
      // Use a short delay to ensure the DOM has the element after navigation
      setTimeout(() => {
        const element = document.getElementById(scrollTargetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // 100ms delay
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {hasPrevPage ? (
            //  Pass the event to the handler
            <PaginationPrevious href="#" onClick={(e) => handleNavigation(e, currentPage - 1)} />
          ) : (
            <span className="p-1 pl-2.5 text-sm font-semibold text-muted-foreground opacity-50 cursor-not-allowed">Previous</span>
          )}
        </PaginationItem>
        <PaginationItem>
          <span className="p-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>
        <PaginationItem>
          {hasNextPage ? (
            // Pass the event to the handler
            <PaginationNext href="#" onClick={(e) => handleNavigation(e, currentPage + 1)} />
          ) : (
            <span className="p-1 pr-2.5 text-sm font-semibold text-muted-foreground opacity-50 cursor-not-allowed">Next</span>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}