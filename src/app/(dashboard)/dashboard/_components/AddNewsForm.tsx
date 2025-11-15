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

const categories = ['Technology', 'Travel', 'Sports', 'Business', 'Culture', 'News'];

// Helper function to create a URL-friendly slug
function slugify(text: string) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function AddNewsForm() {
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle)); // Auto-generate slug as user types
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    formData.append('content', content);

    const result = await createArticle(formData);

    if (result.success) {
      toast.success("Success", { description: "Article created successfully." });
      form.reset();
      setTitle('');
      setSlug('');
      setContent('');
      setImageSource('url');
    } else {
      toast.error("Error", { description: result.error || "Failed to create article." });
    }
    setIsSubmitting(false);
  };

  return (
    //  Make the Card a flex container
    <Card className="flex flex-col p-5 rounded-md">
      <CardHeader>
        <CardTitle>Create New Article</CardTitle>
      </CardHeader>
      {/* CHANGE 2: Make CardContent grow and also be a flex container */}
      <CardContent className="flex-grow flex flex-col">
        {/* CHANGE 3: Make the form grow and also be a flex container */}
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
            <Select name="category" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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

          {/* --- SEO FIELDS --- */}
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

          {/* CHANGE 4: Make the content section expand 
          <div className="space-y-2 flex flex-col flex-grow">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" name="content" placeholder="Write your article content here..." required className="flex-grow" />
          </div>*/}

          <div className="space-y-2 flex flex-col flex-grow">
            <Label>Content</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              onBlur={() => { }} // You can use this for form validation if needed
            />
          </div>

          {/* This button will now be pushed to the bottom */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Publishing...' : 'Publish Article'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}