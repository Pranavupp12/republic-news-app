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
              {/* CHANGE 1: Add the new column header */}
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
              // CHANGE 2: Get the "index" from the map function
              articles.map((article, index) => (
                <TableRow key={article.id}>
                  {/* And display the serial number (index + 1) */}
                  <TableCell className="font-medium">{serialNumberOffset + index + 1}</TableCell>
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
                  <TableCell>{article.category}</TableCell>
                  {!isTodayFilterActive && (
                    <TableCell>
                      <FeaturedToggleButton article={article} />
                    </TableCell>
                  )}
                  {!isTodayFilterActive && (
                    <TableCell><TrendingToggleButton article={article} trendingCount={trendingCount} /></TableCell>
                  )}
                  <TableCell>{article.author?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {new Date(article.createdAt).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => handleOpenUpdateModal(article)}>Update</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleOpenDeleteModal(article)}>Delete</Button>
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

      <UpdateNewsModal article={articleToUpdate} isOpen={isUpdateModalOpen} onClose={handleCloseUpdateModal} />
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleConfirmDelete} />
    </>
  );
}