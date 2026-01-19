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
import { ARTICLE_CATEGORIES } from "@/lib/constants";
import { SEOAnalyzer } from './SeoAnalyser';

function slugify(text: string) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function AddNewsForm() {
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Basic Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // SEO Fields
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(slugify(newTitle)); 
  };

  const handleCategoryToggle = (cat: string) => {
    setSelectedCategories((prev) => 
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    // 1. Explicitly Set Custom Fields (React State -> FormData)
    formData.set('content', content);
    formData.set('imageSource', imageSource);
    
    // SEO Fields
    formData.set('metaTitle', metaTitle);
    formData.set('metaDescription', metaDesc);
    formData.set('metaKeywords', metaKeywords);
    formData.set('focusKeyword', focusKeyword); // Saved to DB

    // Categories (Checkbox Logic)
    selectedCategories.forEach((cat) => {
      formData.append('category', cat);
    });

    const result = await createArticle(formData);

    if (result.success) {
      toast.success("Success", { description: "Article created successfully." });
      form.reset();
      
      // Reset all states
      setTitle('');
      setSlug('');
      setContent('');
      setSelectedCategories([]);
      setFocusKeyword(''); setMetaTitle(''); setMetaDesc(''); setMetaKeywords('');
      setImageSource('url');
    } else {
      toast.error("Error", { description: result.error || "Failed to create article." });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT COLUMN: MAIN FORM (Takes up 2/3 space) */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-5">
          <CardHeader><CardTitle>Create New Article</CardTitle></CardHeader>
          <CardContent>
            <form id="news-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required value={title} onChange={handleTitleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <Label>Categories</Label>
                <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
                  {ARTICLE_CATEGORIES.map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`cat-${cat}`} 
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={() => handleCategoryToggle(cat)}
                      />
                      <Label htmlFor={`cat-${cat}`} className="font-normal cursor-pointer">{cat}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image Source */}
              <div className="space-y-2">
                <Label>Image Source</Label>
                <RadioGroup value={imageSource} onValueChange={(v: any) => setImageSource(v)} className="flex space-x-4">
                  <div className="flex items-center space-x-2"><RadioGroupItem value="url" id="r1" /><Label htmlFor="r1">URL</Label></div>
                  <div className="flex items-center space-x-2"><RadioGroupItem value="upload" id="r2" /><Label htmlFor="r2">Upload</Label></div>
                </RadioGroup>
              </div>
              {imageSource === 'url' ? (
                 <Input name="imageUrl" placeholder="https://example.com/image.png" />
              ) : (
                 <Input name="imageFile" type="file" accept="image/*" />
              )}

              {/* Content Editor */}
              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor value={content} onChange={setContent} onBlur={() => { }} />
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT COLUMN: SEO SETTINGS (Takes up 1/3 space) */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="p-5 bg-slate-50 dark:bg-slate-900/50">
            <CardHeader><CardTitle className="text-lg">SEO Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {/* Focus Keyword */}
                <div className="space-y-2">
                    <Label htmlFor="focusKeyword" className="text-blue-600 font-semibold">Focus Keyword</Label>
                    <Input 
                        id="focusKeyword" 
                        value={focusKeyword}
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        placeholder="Required for analysis" 
                    />
                </div>

                {/* Meta Title with Character Count */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <span className={`text-xs ${metaTitle.length > 60 ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                            {metaTitle.length}/60
                        </span>
                    </div>
                    <Input 
                        id="metaTitle" 
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="SEO Title" 
                    />
                </div>

                {/* Meta Description with Character Count */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="metaDescription">Meta Description</Label>
                        <span className={`text-xs ${metaDesc.length > 160 ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                            {metaDesc.length}/160
                        </span>
                    </div>
                    <Textarea 
                        id="metaDescription" 
                        value={metaDesc}
                        onChange={(e) => setMetaDesc(e.target.value)}
                        placeholder="Search engine summary..." 
                        className="h-24 resize-none"
                    />
                </div>

                 {/* Meta Keywords */}
                 <div className="space-y-2">
                    <Label htmlFor="metaKeywords">Meta Keywords</Label>
                    <Input 
                        id="metaKeywords" 
                        value={metaKeywords}
                        onChange={(e) => setMetaKeywords(e.target.value)}
                        placeholder="keyword1, keyword2" 
                    />
                </div>

                {/* THE ANALYZER COMPONENT */}
                <SEOAnalyzer 
                    content={content} 
                    keyword={focusKeyword} 
                    title={title}
                    metaTitle={metaTitle}
                    metaDesc={metaDesc}
                    metaKeywords={metaKeywords}
                />

                {/* Submit Button (Placed here for easy access on right sidebar) */}
                <Button 
                    type="submit" 
                    form="news-form" // Links to the form ID in left column
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700" 
                    disabled={isSubmitting || selectedCategories.length === 0}
                >
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? 'Publishing...' : 'Publish Article'}
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}