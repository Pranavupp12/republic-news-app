'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { StorySlide } from '@prisma/client';
import { UpdateSlideModal } from './UpdateSlideModal';
import { DeleteSlideConfirmationModal } from './DeleteSlideConfirmationModal';

interface SlideModalContextType {
  openUpdateModal: (slide: StorySlide) => void;
  openDeleteModal: (slide: StorySlide) => void;
}

const SlideModalContext = createContext<SlideModalContextType | undefined>(undefined);

export function useSlideModal() {
  const context = useContext(SlideModalContext);
  if (context === undefined) {
    throw new Error('useSlideModal must be used within a SlideModalProvider');
  }
  return context;
}

interface SlideModalProviderProps {
  children: ReactNode;
}

export function SlideModalProvider({ children }: SlideModalProviderProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [slideToUpdate, setSlideToUpdate] = useState<StorySlide | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<StorySlide | null>(null);

  const openUpdateModal = (slide: StorySlide) => {
    setSlideToUpdate(slide);
    setIsUpdateModalOpen(true);
  };

  const openDeleteModal = (slide: StorySlide) => {
    setSlideToDelete(slide);
    setIsDeleteModalOpen(true);
  };

  const contextValue = { openUpdateModal, openDeleteModal };

  return (
    <SlideModalContext.Provider value={contextValue}>
      {children}
      <UpdateSlideModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        slide={slideToUpdate} 
      />
      <DeleteSlideConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        slide={slideToDelete} 
      />
    </SlideModalContext.Provider>
  );
}