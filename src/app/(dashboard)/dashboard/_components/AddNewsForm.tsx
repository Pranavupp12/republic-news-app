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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { ARTICLE_CATEGORIES } from '@/lib/constants';

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
  // 1. ADD STATE FOR CATEGORY
  const [category, setCategory] = useState(''); 

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle)); 
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    // 2. MANUALLY APPEND THE CONTENT AND CATEGORY TO FORM DATA
    formData.set('content', content); // .set replaces existing if any
    formData.set('category', category); // This ensures the selected value is sent, not the default

    const result = await createArticle(formData);

    if (result.success) {
      toast.success("Success", { description: "Article created successfully." });
      form.reset();
      
      // 3. RESET ALL STATES
      setTitle('');
      setSlug('');
      setContent('');
      setCategory(''); // Reset category
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

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            {/* 4. BIND VALUE AND ONVALUECHANGE TO STATE */}
            <Select 
              name="category" 
              required 
              value={category} 
              onValueChange={setCategory}
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
            <RichTextEditor
              value={content}
              onChange={setContent}
              onBlur={() => { }} 
            />
          </div>

          <Button type="submit" className="w-full bg-blue-500 text-white hover:bg-blue-600" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}