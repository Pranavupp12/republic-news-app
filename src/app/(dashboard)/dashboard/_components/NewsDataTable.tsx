"use client";

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteArticle } from "@/actions/newsActions";
import { toast } from "sonner";
import type { Article, User } from '@prisma/client';
import { UpdateNewsModal } from './UpdateNewsModal';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { FeaturedToggleButton } from './FeaturedToggleButton';
import { CheckSeoModal } from './CheckSeoModal'; // 1. IMPORT NEW MODAL
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingToggleButton } from './TrendingToggleButton';
import { SendNotificationButton } from './SendNotificationButton'; 
import { Badge } from '@/components/ui/badge';
import Link from 'next/link'; // 2. IMPORT LINK
import { Eye, ScanSearch, Pencil, Trash2 } from 'lucide-react'; // 3. IMPORT ICONS

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
  // Update Modal State
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [articleToUpdate, setArticleToUpdate] = useState<Article | null>(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // 4. NEW: SEO Modal State
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [articleToAnalyze, setArticleToAnalyze] = useState<Article | null>(null);

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

  // 5. NEW: SEO Handler
  const handleOpenSeoModal = (article: Article) => {
    setArticleToAnalyze(article);
    setIsSeoModalOpen(true);
  }
  const handleCloseSeoModal = () => {
    setIsSeoModalOpen(false);
    setArticleToAnalyze(null);
  }

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

                  <TableCell>{article.category.map((cat, idx) => (
                    <div key={idx} className="inline-block mr-2 mb-1">
                      <Badge variant="secondary" className="text-xs">{cat}</Badge>
                    </div>
                  ))}</TableCell>

                  {!isTodayFilterActive && (
                    <TableCell><FeaturedToggleButton article={article} /></TableCell>
                  )}
                  {!isTodayFilterActive && (
                    <TableCell><TrendingToggleButton article={article} trendingCount={trendingCount} /></TableCell>
                  )}

                  <TableCell>{article.author?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(article.createdAt).toLocaleDateString('en-IN')}</TableCell>

                  {/* ACTIONS COLUMN */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      
                      {/* A. VIEW BUTTON (Eye Icon) */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                              {/* Using Next Link to navigate */}
                              <Link href={`/article/${article.slug}`} target="_blank">
                                <Eye className="h-4 w-4 text-blue-600" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Article</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* B. CHECK SEO BUTTON (Scan Icon) */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenSeoModal(article)}>
                                <ScanSearch className="h-4 w-4 text-purple-600" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Check SEO</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* C. Notification */}
                      <SendNotificationButton article={article} />

                      {/* D. Update Button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenUpdateModal(article)}>
                                <Pencil className="h-4 w-4 text-slate-600" />
                             </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {/* E. Delete Button */}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenDeleteModal(article)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                             </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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

      <UpdateNewsModal article={articleToUpdate} isOpen={isUpdateModalOpen} onClose={handleCloseUpdateModal} />
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={handleCloseDeleteModal} onConfirm={handleConfirmDelete} />
      
      {/* 6. RENDER NEW SEO MODAL */}
      <CheckSeoModal article={articleToAnalyze} isOpen={isSeoModalOpen} onClose={handleCloseSeoModal} />
    </>
  );
}