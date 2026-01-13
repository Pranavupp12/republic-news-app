'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteArticle } from "@/actions/newsActions";
import { toast } from "sonner";
import type { Article, User } from '@prisma/client';
import { UpdateNewsModal } from './UpdateNewsModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { FeaturedToggleButton } from './FeaturedToggleButton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingToggleButton } from './TrendingToggleButton';
import { SendNotificationButton } from './SendNotificationButton'; // Import the button
import { Badge } from '@/components/ui/badge';

type ArticleWithAuthor = Article & {
  author: User | null;
};

interface NewsDataTableProps {
  articles: ArticleWithAuthor[];
  currentPage: number;
  articlesPerPage: number;
  isTodayFilterActive: boolean;
  trendingCount: number;
}

// Helper function to truncate text by word count
const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
};

export function NewsDataTable({ articles, currentPage, articlesPerPage, isTodayFilterActive, trendingCount }: NewsDataTableProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [articleToUpdate, setArticleToUpdate] = useState<Article | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  const handleOpenUpdateModal = (article: Article) => {
    setArticleToUpdate(article);
    setIsUpdateModalOpen(true);
  };
  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setArticleToUpdate(null);
  };

  const handleOpenDeleteModal = (article: Article) => {
    setArticleToDelete(article);
    setIsDeleteModalOpen(true);
  };
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setArticleToDelete(null);
  };
  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    const result = await deleteArticle(articleToDelete.id);
    if (result.success) {
      toast.success("Success", { description: "Article deleted." });
    } else {
      toast.error("Error", { description: result.error });
    }
    handleCloseDeleteModal();
  };

  // Calculate the starting serial number for the current page
  const serialNumberOffset = (currentPage - 1) * articlesPerPage;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">S.No.</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              {!isTodayFilterActive && <TableHead>Featured</TableHead>}
              {!isTodayFilterActive && <TableHead>Trending</TableHead>}
              <TableHead>Author</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <TableRow key={article.id}>
                  {/* Serial Number */}
                  <TableCell className="font-medium">{serialNumberOffset + index + 1}</TableCell>

                  {/* Title with Tooltip */}
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-default">{truncateText(article.title, 14)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{article.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  {/* Category */}
                  <TableCell>{article.category.map((cat, index) => (
                    <div key={index} className="inline-block mr-2 mb-1">
                      <Badge key={index} variant="secondary" className="text-xs ">
                      {cat}
                    </Badge>
                    </div>
                    
                  ))}</TableCell>

                  {/* Feature Toggles (Hidden on 'Today' filter) */}
                  {!isTodayFilterActive && (
                    <TableCell>
                      <FeaturedToggleButton article={article} />
                    </TableCell>
                  )}
                  {!isTodayFilterActive && (
                    <TableCell>
                      <TrendingToggleButton article={article} trendingCount={trendingCount} />
                    </TableCell>
                  )}

                  {/* Author & Date */}
                  <TableCell>{article.author?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(article.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>

                  {/* ACTIONS COLUMN */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* 1. Notification Button */}
                      <SendNotificationButton article={article} />

                      {/* 2. Update Button */}
                      <Button variant="outline" size="sm" onClick={() => handleOpenUpdateModal(article)}>
                        Update
                      </Button>

                      {/* 3. Delete Button */}
                      <Button variant="destructive" size="sm" onClick={() => handleOpenDeleteModal(article)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={isTodayFilterActive ? 7 : 8} className="h-24 text-center">
                  No articles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals live outside the table to prevent layout issues */}
      <UpdateNewsModal article={articleToUpdate} isOpen={isUpdateModalOpen} onClose={handleCloseUpdateModal} />
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleConfirmDelete} />
    </>
  );
}