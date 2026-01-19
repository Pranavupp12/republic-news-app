'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; 
import { toast } from "sonner";
import { updateArticle } from "@/actions/newsActions";
import type { Article } from '@prisma/client';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox"; 
import { RichTextEditor } from './RichTextEditor'; 
import { Loader2 } from "lucide-react";
import { ARTICLE_CATEGORIES } from '@/lib/constants';

function slugify(text: string) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

interface UpdateNewsModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateNewsModal({ article, isOpen, onClose }: UpdateNewsModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  
  // Controlled States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // 1. ADDED FOCUS KEYWORD STATE
  const [focusKeyword, setFocusKeyword] = useState('');

  // Sync prop to local state when the modal opens/article changes
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSlug(article.slug || '');
      setContent(article.content);
      setImageSource('url');
      // 2. LOAD FOCUS KEYWORD
      setFocusKeyword(article.focusKeyword || '');
      
      if (Array.isArray(article.category)) {
        setSelectedCategories(article.category);
      } else if (typeof article.category === 'string') {
        setSelectedCategories([article.category]);
      } else {
        setSelectedCategories([]);
      }
    }
  }, [article]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle)); 
  };

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) => 
      prev.includes(cat) 
        ? prev.filter((c) => c !== cat) 
        : [...prev, cat] 
    );
  };

  if (!article) return null; 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    // FormData automatically captures all inputs with 'name' attributes
    const formData = new FormData(event.currentTarget);
    formData.set('content', content); 
    
    // The native checkboxes will be collected as multiple 'category' entries by the browser
    // The native 'focusKeyword' input will be collected automatically because it has name="focusKeyword"

    const result = await updateArticle(article.id, formData);

    if (result.success) {
      toast.success("Article Updated", {
        description: "The article has been successfully updated.",
      });
      onClose();
    } else {
      toast.error("Update Failed", {
        description: result.error || "An unexpected error occurred.",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Update Article</DialogTitle>
          <DialogDescription>
            Make changes to your article here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="overflow-y-auto px-1 max-h-[70vh] space-y-4 pr-4">
            
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={title} onChange={handleTitleChange} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Blog URL Slug</Label>
              <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              <p className="text-xs text-muted-foreground">e.g., /article/{slug}</p>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <Label>Categories (Select at least one)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded-md">
                {ARTICLE_CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`update-cat-${cat}`} 
                      name="category" 
                      value={cat}
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={() => handleCategoryToggle(cat)}
                    />
                    <Label 
                      htmlFor={`update-cat-${cat}`} 
                      className="text-sm font-normal cursor-pointer select-none"
                    >
                      {cat}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedCategories.length === 0 && (
                <p className="text-[0.8rem] font-medium text-destructive">
                  Please select at least one category.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Current Image</Label>
              <div className="relative w-24 h-24 rounded-md overflow-hidden border">
                 <Image src={article.imageUrl} alt={article.title} fill className="object-cover" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>New Image Source (Optional)</Label>
              <RadioGroup
                name="imageSource"
                value={imageSource}
                onValueChange={(value: 'url' | 'upload') => setImageSource(value)}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2"><RadioGroupItem value="url" id="r-update-url" /><Label htmlFor="r-update-url">URL</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="upload" id="r-update-upload" /><Label htmlFor="r-update-upload">Upload</Label></div>
              </RadioGroup>
            </div>

            {imageSource === 'url' ? (
              <div className="space-y-2">
                <Label htmlFor="imageUrl">New Image URL</Label>
                <Input id="imageUrl" name="imageUrl" placeholder="Leave blank to keep current image" />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="imageFile">Upload New Image</Label>
                <Input id="imageFile" name="imageFile" type="file" accept="image/*" />
              </div>
            )}

            {/* 3. ADDED FOCUS KEYWORD FIELD */}
            <div className="space-y-2 pt-4 border-t mt-4">
                <Label htmlFor="focusKeyword" className="text-blue-600 font-semibold">Focus Keyword</Label>
                <Input 
                    id="focusKeyword" 
                    name="focusKeyword" 
                    value={focusKeyword} 
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="Updated focus keyword" 
                />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
              <Input id="metaTitle" name="metaTitle" placeholder="Optional: SEO-friendly title" defaultValue={article.metaTitle || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
              <Textarea id="metaDescription" name="metaDescription" placeholder="Optional: Short description for search engines" defaultValue={article.metaDescription || ''} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaKeywords">Meta Keywords (SEO)</Label>
              <Input id="metaKeywords" name="metaKeywords" placeholder="Optional: comma, separated, keywords" defaultValue={article.metaKeywords || ''} />
            </div>

            <div className="space-y-2 flex flex-col flex-grow">
              <Label>Content</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                onBlur={() => {}} 
              />
            </div>

          </div>
          
          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white" disabled={isSubmitting || selectedCategories.length === 0}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}