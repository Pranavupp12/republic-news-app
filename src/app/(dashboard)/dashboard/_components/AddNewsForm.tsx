'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createArticle } from "@/actions/newsActions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { Checkbox } from "@/components/ui/checkbox";
import { ARTICLE_CATEGORIES } from "@/lib/constants"; // 1. Import from constants

function slugify(text: string) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function AddNewsForm() {
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle)); 
  };

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) => 
      prev.includes(cat) 
        ? prev.filter((c) => c !== cat) // Uncheck
        : [...prev, cat] // Check
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Manually set content
    formData.set('content', content); 

    const result = await createArticle(formData);

    if (result.success) {
      toast.success("Success", { description: "Article created successfully." });
      form.reset();
      
      // Reset states
      setTitle('');
      setSlug('');
      setContent('');
      setSelectedCategories([]); 
      setImageSource('url');
    } else {
      toast.error("Error", { description: result.error || "Failed to create article." });
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="flex flex-col p-5 rounded-md">
      <CardHeader>
        <CardTitle>Create New Article</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Article Title" required value={title} onChange={handleTitleChange} />
          </div>
           
          <div className="space-y-2">
            <Label htmlFor="slug">Blog URL Slug</Label>
            <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
            <p className="text-xs text-muted-foreground">e.g., /article/{slug}</p>
          </div>

          {/* Categories Grid */}
          <div className="space-y-3">
            <Label>Categories (Select at least one)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded-md">
              {/* 2. Map over ARTICLE_CATEGORIES instead of hardcoded list */}
              {ARTICLE_CATEGORIES.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${cat}`} 
                    name="category" 
                    value={cat}
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={() => handleCategoryToggle(cat)}
                  />
                  <Label 
                    htmlFor={`cat-${cat}`} 
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
            <Label>Image Source</Label>
            <RadioGroup name="imageSource" value={imageSource} onValueChange={(value: 'url' | 'upload') => setImageSource(value)} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="url" id="r1" /><Label htmlFor="r1">URL</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="upload" id="r2" /><Label htmlFor="r2">Upload</Label></div>
            </RadioGroup>
          </div>
          {imageSource === 'url' ? (
            <div className="space-y-2"><Label htmlFor="imageUrl">Image URL</Label><Input id="imageUrl" name="imageUrl" placeholder="https://example.com/image.png" /></div>
          ) : (
            <div className="space-y-2"><Label htmlFor="imageFile">Upload Image</Label><Input id="imageFile" name="imageFile" type="file" accept="image/*" /></div>
          )}

          {/* SEO Fields */}
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
            <Input id="metaTitle" name="metaTitle" placeholder="Optional: SEO-friendly title" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
            <Textarea id="metaDescription" name="metaDescription" placeholder="Optional: Short description for search engines" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaKeywords">Meta Keywords (SEO)</Label>
            <Input id="metaKeywords" name="metaKeywords" placeholder="Optional: comma, separated, keywords" />
          </div>

          <div className="space-y-2 flex flex-col flex-grow">
            <Label>Content</Label>
            {/* Optional: If you want the Editor heading to update based on selection, 
              you can pass `category={selectedCategories[0]}` here.
              For now, keeping it as requested.
            */}
            <RichTextEditor
              value={content}
              onChange={setContent}
              onBlur={() => { }} 
            />
          </div>

          <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600" disabled={isSubmitting || selectedCategories.length === 0}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}