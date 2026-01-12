'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react'; // Import Spinner

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Update type to Promise so we can await it
  onConfirm: () => Promise<void>; 
}

export function DeleteStoryConfirmationModal({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  // FIX: Reset the state every time the modal opens to prevent the "infinite load" glitch
  useEffect(() => {
    if (isOpen) {
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleDeleteClick = async () => {
    setIsDeleting(true);
    await onConfirm();
    // No need to set false here manually, the useEffect handles it on next open
    // or the component unmounts/closes.
  };

  return (
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
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleDeleteClick}
            variant="destructive"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Yes, delete story'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}