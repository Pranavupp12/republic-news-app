'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteStoryConfirmationModal({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) {
  return (
    // Use the standard Dialog component
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the web
            story and all of its slides.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {/* DialogClose will act as the "Cancel" button and also work with the 'X' icon */}
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={onConfirm}
            variant="destructive"
          >
            Yes, delete story
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}