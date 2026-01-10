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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  // 1. Add Category State
  const [category, setCategory] = useState(''); 

  // Sync prop to local state when the modal opens/article changes
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSlug(article.slug || '');
      setContent(article.content);
      // 2. Load existing category
      setCategory(article.category); 
      setImageSource('url'); 
    }
  }, [article]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle)); 
  };

  if (!article) return null; 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(event.currentTarget);
    formData.set('content', content); 
    // 3. Manually append the category
    formData.set('category', category); 
    
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

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {/* 4. Use Controlled Component */}
              <Select 
                name="category" 
                value={category} 
                onValueChange={setCategory} 
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Current Image</Label>
              <Image src={article.imageUrl} alt={article.title} width={100} height={100} className="rounded-md object-cover border" />
            </div>

            <div className="space-y-2">
              <Label>New Image Source (Optional)</Label>
              <RadioGroup
                name="imageSource"
                value={imageSource}
                onValueChange={(value: 'url' | 'upload') => setImageSource(value)}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2"><RadioGroupItem value="url" id="r-url" /><Label htmlFor="r-url">URL</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="upload" id="r-upload" /><Label htmlFor="r-upload">Upload</Label></div>
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}