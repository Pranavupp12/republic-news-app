'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { StorySlide } from "@prisma/client";

interface DeleteSlideConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  slide: StorySlide | null;
  // 1. Add this prop to the interface
  onConfirm: () => Promise<void>; 
}

export function DeleteSlideConfirmationModal({ isOpen, onClose, slide, onConfirm }: DeleteSlideConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // 2. Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) setIsDeleting(false);
  }, [isOpen]);

  const handleDeleteClick = async () => {
    if (!slide) return;
    setIsDeleting(true);
    // 3. Call the parent function
    await onConfirm(); 
    // State reset happens on close/unmount
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>This will permanently delete this slide. This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline" disabled={isDeleting}>Cancel</Button></DialogClose>
          
          {/* 4. Show spinner */}
          <Button onClick={handleDeleteClick} variant="destructive" disabled={isDeleting}>
             {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
             ) : (
                'Delete Slide'
             )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
