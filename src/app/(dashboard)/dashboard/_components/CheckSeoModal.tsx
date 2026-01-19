"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SEOAnalyzer } from "./SeoAnalyser"; // Import your existing component
import type { Article } from "@prisma/client";
import { RefreshCcw } from "lucide-react";

interface CheckSeoModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CheckSeoModal({ article, isOpen, onClose }: CheckSeoModalProps) {
  // Local state for the keyword we want to test (defaults to DB value)
  const [testKeyword, setTestKeyword] = useState("");

  // When modal opens, load the existing keyword from the article
  useEffect(() => {
    if (isOpen && article) {
      setTestKeyword(article.focusKeyword || "");
    }
  }, [isOpen, article]);

  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>SEO Audit: {article.title}</DialogTitle>
          <DialogDescription>
            Analyze this article against a new focus keyword without saving changes.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {/* Test Input Area */}
          <div className="p-4 border rounded-md bg-slate-50 dark:bg-slate-900/50 space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-blue-600 font-semibold">Test Focus Keyword</Label>
                <span className="text-xs text-muted-foreground">
                    Original: <strong>{article.focusKeyword || "None"}</strong>
                </span>
            </div>
            <div className="flex gap-2">
                <Input
                  value={testKeyword}
                  onChange={(e) => setTestKeyword(e.target.value)}
                  placeholder="Enter keyword to analyze..."
                  className="bg-background"
                />
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setTestKeyword(article.focusKeyword || "")}
                    title="Reset to Original"
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
            </div>
          </div>

          {/* REUSE THE ANALYZER COMPONENT */}
          {/* We pass the article's existing content, but the NEW testKeyword */}
          <div className="border-none p-1">
            <SEOAnalyzer
              content={article.content}
              keyword={testKeyword}
              title={article.title}
              metaTitle={article.metaTitle || ""}
              metaDesc={article.metaDescription || ""}
              metaKeywords={article.metaKeywords || ""}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}