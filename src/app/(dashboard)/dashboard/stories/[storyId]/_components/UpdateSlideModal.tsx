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
import type { StorySlide } from "@prisma/client";
import { updateSlide } from "@/actions/webStoryAction";
import { toast } from "sonner";
import Image from "next/image";

interface UpdateSlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide: StorySlide | null;
}

export function UpdateSlideModal({ isOpen, onClose, slide }: UpdateSlideModalProps) {
  const [caption, setCaption] = useState(slide?.caption || '');
  const [imageSource, setImageSource] = useState<'url' | 'upload'>('url');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (slide) {
      setCaption(slide.caption || '');
      // Reset image source choice when a new slide is selected
      setImageSource('url');
    }
  }, [slide]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slide) return;
    setIsSubmitting(true);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    
    const result = await updateSlide(slide.id, formData);
    
    if (result.success) {
      toast.success('Slide updated successfully!');
      onClose();
    } else {
      toast.error(result.error || 'Failed to update slide.');
    }
    setIsSubmitting(false);
  };

  if (!slide) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Slide</DialogTitle>
          <DialogDescription>Edit the caption or provide a new image for this slide.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Input id="caption" name="caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Current Image</Label>
            <div className="relative h-48 w-full rounded-md overflow-hidden">
                <Image src={slide.imageUrl} alt="Current slide image" fill className="object-cover"/>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>New Image (Optional)</Label>
            <RadioGroup name="slideImageSource" value={imageSource} onValueChange={(v: 'url' | 'upload') => setImageSource(v)} className="flex items-center space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="url" id="r-update-slide-url" /><Label htmlFor="r-update-slide-url">URL</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="upload" id="r-update-slide-upload" /><Label htmlFor="r-update-slide-upload">Upload</Label></div>
            </RadioGroup>
          </div>

          {imageSource === 'url' ? (
            <div className="space-y-2"><Label>Image URL</Label><Input name="slideImageUrl" placeholder="Leave blank to keep current image"/></div>
          ) : (
            <div className="space-y-2"><Label>Upload Image</Label><Input name="slideImage" type="file" accept="image/*"/></div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}