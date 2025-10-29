'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import type { StorySlide } from "@prisma/client";
import { deleteSlide } from "@/actions/webStoryAction";
import { toast } from "sonner";

interface DeleteSlideConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide: StorySlide | null;
}

export function DeleteSlideConfirmationModal({ isOpen, onClose, slide }: DeleteSlideConfirmationModalProps) {
  const handleConfirmDelete = async () => {
    if (!slide) return;
    const result = await deleteSlide(slide.id);
    if (result.success) {
      toast.success('Slide deleted successfully!');
      onClose();
    } else {
      toast.error(result.error || 'Failed to delete slide.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This will permanently delete this slide. This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={handleConfirmDelete} variant="destructive">Delete Slide</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}