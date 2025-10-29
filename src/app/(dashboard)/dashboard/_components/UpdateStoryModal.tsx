'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react";
import type { WebStory } from "@prisma/client";
import { updateWebStory } from "@/actions/webStoryAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image"; 

interface UpdateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: WebStory | null;
}

export function UpdateStoryModal({ isOpen, onClose, story }: UpdateStoryModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState(story?.title || '');
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url'); // Default to URL
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setImageSource('url'); // Reset image source selection when story changes
    }
  }, [story]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story) return;

    setIsSubmitting(true);
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    // Add storyId to formData for the server action
    formData.append('storyId', story.id); 

    const result = await updateWebStory(story.id, formData);
    
    if (result.success) {
      toast.success('Web Story updated successfully!');
      router.refresh(); // Refresh the page to show changes
      onClose();
    } else {
      toast.error(result.error || 'Failed to update web story.');
    }
    setIsSubmitting(false);
  };

  if (!story) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Web Story</DialogTitle>
          <DialogDescription>Make changes to your story here. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          {/* --- NEW: Display Current Cover Image --- */}
          <div className="space-y-2">
            <Label>Current Cover Image</Label>
            <div className="relative h-48 w-full rounded-md overflow-hidden">
                <Image src={story.coverImage} alt="Current cover image" fill className="object-cover"/>
            </div>
          </div>

          {/* --- NEW/MODIFIED: New Cover Image Section --- */}
          <div className="space-y-2">
            <Label>New Cover Image (Optional)</Label>
            <RadioGroup name="coverImageSource" value={imageSource} onValueChange={(v: 'url' | 'upload') => setImageSource(v)} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="url" id="r-update-url" /><Label htmlFor="r-update-url">URL</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="upload" id="r-update-upload" /><Label htmlFor="r-update-upload">Upload</Label></div>
            </RadioGroup>
          </div>

          {imageSource === 'url' ? (
            <div className="space-y-2"><Label>Image URL</Label><Input name="coverImageUrl" placeholder="Leave blank to keep current image"/></div>
          ) : (
            <div className="space-y-2"><Label>Upload Image</Label><Input name="coverImage" type="file" accept="image/*"/></div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}