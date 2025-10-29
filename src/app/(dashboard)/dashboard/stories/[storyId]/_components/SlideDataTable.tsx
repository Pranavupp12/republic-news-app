'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface SlideDataTableProps {
  slides: StorySlide[];
  authorName: string;
}

// Helper function to truncate text by word count
const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

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


      {/* Render the modals */}
      < UpdateSlideModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)
        }
        slide={slideToUpdate}
      />
      <DeleteSlideConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        slide={slideToDelete}
      />
    </>
  );
}