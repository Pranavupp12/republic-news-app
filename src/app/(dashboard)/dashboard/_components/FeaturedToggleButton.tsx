'use client';

import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { toggleFeaturedStatus } from '@/actions/newsActions';
import type { Article } from '@prisma/client';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FeaturedToggleButtonProps {
  article: Article;
}

const isDateToday = (date: Date) => {
  const today = new Date();
  const d = new Date(date);
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

export function FeaturedToggleButton({ article }: FeaturedToggleButtonProps) {
  const [isFeatured, setIsFeatured] = useState(article.isFeatured);
  const isArticleFromToday = isDateToday(article.createdAt);
  
  // Check if the article is currently trending
  const isTrending = article.isTrending;
  const isDisabled = isArticleFromToday || isTrending;
  
  // Determine the tooltip message
  let tooltipMessage = '';
  if (isArticleFromToday) {
    tooltipMessage = "Today's articles cannot be featured.";
  } else if (isTrending) {
    tooltipMessage = "Cannot feature a trending article.";
  }

  const handleToggle = async (checked: boolean) => {
    setIsFeatured(checked);

    const result = await toggleFeaturedStatus(article.id, checked);

    if (!result.success) {
      setIsFeatured(!checked);
      toast.error("Update Failed", {
        description: result.error,
      });
    }
  };

  if (isDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* The disabled state is now a span to avoid button-in-button issues */}
            <span>
              <Switch
                checked={isFeatured}
                disabled={true}
              />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Switch
      checked={isFeatured}
      onCheckedChange={handleToggle}
    />
  );
}