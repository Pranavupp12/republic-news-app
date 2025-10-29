'use client';

import { useState } from 'react';
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
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmationModal({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmClick = async () => {
    setIsDeleting(true);
    await onConfirm();
    // No need to set isDeleting to false here, as the component will unmount
  };

  return (
    // Use the standard Dialog component
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            article from the server.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {/* DialogClose will act as the "Cancel" button and also work with the 'X' icon */}
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleConfirmClick}
            disabled={isDeleting}
            variant="destructive"
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete article'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}