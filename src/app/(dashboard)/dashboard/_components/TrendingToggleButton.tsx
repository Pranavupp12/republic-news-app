'use client';

import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { toggleTrendingStatus } from '@/actions/newsActions';
import type { Article } from '@prisma/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TrendingToggleButtonProps {
  article: Article;
  trendingCount: number;
}

// Helper function to check if a date is today
const isDateToday = (date: Date) => {
  const today = new Date();
  const d = new Date(date);
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

export function TrendingToggleButton({ article, trendingCount }: TrendingToggleButtonProps) {
  const [isTrending, setIsTrending] = useState(article.isTrending);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trendingTopic, setTrendingTopic] = useState(article.trendingTopic || '');

  // --- ADD CHECKS FOR DISABLING THE TOGGLE ---
  const isArticleFromToday = isDateToday(article.createdAt);
  const isFeatured = article.isFeatured;
  const isDisabled = isArticleFromToday || isFeatured;

  // Determine the tooltip message based on the reason
  let tooltipMessage = '';
  if (isArticleFromToday) {
    tooltipMessage = "Today's articles cannot be set as trending.";
  } else if (isFeatured) {
    tooltipMessage = "Cannot set a featured article as trending.";
  }
  // --- END OF CHECKS ---

  const handleToggle = async (checked: boolean) => {
    // --- THIS IS THE FIX ---
    // If trying to turn ON the toggle...
    if (checked) {
      // First, check if the limit is already reached.
      if (trendingCount >= 7) {
        // Show an error and do nothing else. The switch won't even toggle.
        toast.error("Limit Reached", {
          description: "Cannot have more than 7 trending articles.",
        });
        return; // Stop the function here
      }
      // If the limit is not reached, open the dialog.
      setIsDialogOpen(true);
    } else {
      // If turning OFF, just call the action.
      setIsTrending(false);
      const result = await toggleTrendingStatus(article.id, false);
      if (!result.success) {
        setIsTrending(true);
        toast.error("Update Failed", { description: result.error });
      }
    }
  };

  const handleConfirm = async () => {
    setIsTrending(true);
    setIsDialogOpen(false);
    const result = await toggleTrendingStatus(article.id, true, trendingTopic);
    if (!result.success) {
      setIsTrending(false);
      toast.error("Update Failed", { description: result.error });
    }
  };
  
  // If the toggle should be disabled, render it with a tooltip
  if (isDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Switch checked={isTrending} disabled={true} />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipMessage}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Otherwise, render the fully functional toggle and dialog
  return (
    <>
      <Switch
        checked={isTrending}
        onCheckedChange={handleToggle}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Trending Topic</DialogTitle>
            <DialogDescription>
              Enter the short text that will appear in the trending pill.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trending-topic" className="text-right">Topic</Label>
              <Input
                id="trending-topic"
                value={trendingTopic}
                onChange={(e) => setTrendingTopic(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleConfirm}>Set as Trending</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}