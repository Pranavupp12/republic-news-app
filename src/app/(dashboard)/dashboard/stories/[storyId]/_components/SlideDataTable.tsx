'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import type { StorySlide } from '@prisma/client';
import { UpdateSlideModal } from './UpdateSlideModal';
import { DeleteSlideConfirmationModal } from './DeleteSlideConfirmationModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// 1. ADD MISSING IMPORTS
import { deleteSlide } from "@/actions/webStoryAction";
import { toast } from "sonner";

interface SlideDataTableProps {
  slides: StorySlide[];
  authorName: string;
}

export function SlideDataTable({ slides, authorName }: SlideDataTableProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [slideToUpdate, setSlideToUpdate] = useState<StorySlide | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<StorySlide | null>(null);

  const handleOpenUpdateModal = (slide: StorySlide) => {
    setSlideToUpdate(slide);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDeleteModal = (slide: StorySlide) => {
    setSlideToDelete(slide);
    setIsDeleteModalOpen(true);
  };

  // 2. DEFINE THE DELETE FUNCTION HERE
  const handleConfirmDelete = async () => {
    if (!slideToDelete) return;
    
    const result = await deleteSlide(slideToDelete.id);
    
    if (result.success) {
      toast.success('Slide deleted successfully!');
      // The modal will close automatically after this function finishes
      // because we handle state in the Modal's button logic or here.
      setIsDeleteModalOpen(false);
    } else {
      toast.error(result.error || 'Failed to delete slide.');
    }
  };

  return (
    <>
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold font-heading">Current Slides ({slides.length})</h2>
        </div>
        {slides.length === 0 ? (
          <p className="text-muted-foreground">No slides added yet.</p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Slide</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Caption</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map((slide, index) => (
                  <TableRow key={slide.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Image
                        src={slide.imageUrl}
                        alt={slide.caption || 'Slide image'}
                        width={50}
                        height={75}
                        className="object-cover rounded-sm aspect-[9/16]"
                      />
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="cursor-default block truncate">
                              {slide.caption || 'No caption'}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{slide.caption}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>{authorName}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleOpenUpdateModal(slide)}>Update</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteModal(slide)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>

      <UpdateSlideModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        slide={slideToUpdate}
      />
      
      {/* 3. PASS THE FUNCTION TO THE MODAL */}
      <DeleteSlideConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        slide={slideToDelete}
        onConfirm={handleConfirmDelete} // <--- ERROR FIXED HERE
      />
    </>
  );
}