'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createWebStory, deleteWebStory } from "@/actions/webStoryAction";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { WebStory, User } from '@prisma/client';
import Link from "next/link";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UpdateStoryModal } from './UpdateStoryModal';
import { DeleteStoryConfirmationModal } from './DeleteStoryConfirmationModal';
import { PaginationControls } from "@/components/ui/PaginationControls";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { StoryFilterButtons } from './StoryFilterButtons';
import { Loader2 } from 'lucide-react'; 

// Update the type to include the author
type StoryWithAuthor = WebStory & {
    author: User | null;
};

interface WebStoryManagerProps {
    stories: StoryWithAuthor[];
    currentPage: number;
    articlesPerPage: number;
    totalPages: number;
    storyFilter: 'all' | 'today';
}

// Helper function to truncate text by word count
const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
    }
    return text;
};


export function WebStoryManager({ stories, currentPage, articlesPerPage, totalPages, storyFilter }: WebStoryManagerProps) {

    const [imageSource, setImageSource] = useState<'url' | 'upload'>('upload');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [storyToUpdate, setStoryToUpdate] = useState<WebStory | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [storyToDelete, setStoryToDelete] = useState<WebStory | null>(null);


    const handleCreateSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        const form = event.currentTarget;
        const formData = new FormData(form);

        const result = await createWebStory(formData);

        if (result.success) {
            toast.success("Story created successfully!");
            form.reset();
        } else {
            toast.error("Creation Failed", { description: result.error });
        }
        setIsSubmitting(false);
    };

    const handleOpenUpdateModal = (story: WebStory) => {
        setStoryToUpdate(story);
        setIsUpdateModalOpen(true);
    };

    const handleOpenDeleteModal = (story: WebStory) => {
        setStoryToDelete(story);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!storyToDelete) return;
        const result = await deleteWebStory(storyToDelete.id);
        if (result.success) {
            toast.success("Story deleted successfully!");
        } else {
            toast.error("Deletion Failed", { description: result.error });
        }
        setIsDeleteModalOpen(false);
    };

    // Calculate the serial number offset
    const serialNumberOffset = (currentPage - 1) * articlesPerPage;

    return (

        <>

            <div className="grid grid-cols-1 gap-8">
                <section>
                    <Card>
                        <CardHeader><CardTitle>Create New Web Story</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div className="space-y-2"><Label>Title</Label><Input name="title" required /></div>

                                <div className="space-y-2">
                                    <Label>Cover Image Source</Label>
                                    <RadioGroup name="coverImageSource" value={imageSource} onValueChange={(v: 'url' | 'upload') => setImageSource(v)} className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="url" id="r-url" /><Label htmlFor="r-url">URL</Label></div>
                                        <div className="flex items-center space-x-2"><RadioGroupItem value="upload" id="r-upload" /><Label htmlFor="r-upload">Upload</Label></div>
                                    </RadioGroup>
                                </div>

                                {imageSource === 'url' ? (
                                    <div className="space-y-2"><Label>Image URL</Label><Input name="coverImageUrl" placeholder="https://example.com/image.jpg" /></div>
                                ) : (
                                    <div className="space-y-2"><Label>Upload Image</Label><Input name="coverImage" type="file" accept="image/*" /></div>
                                )}

                                <Button type="submit" disabled={isSubmitting} className="w-full">
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isSubmitting ? 'Creating...' : 'Create Story'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </section>

                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold font-heading">Existing Stories</h2>
                        <StoryFilterButtons />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">S.No.</TableHead>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stories.length > 0 ? (
                                    stories.map((story, index) => (
                                        <TableRow key={story.id}>
                                            <TableCell className="pl-6">{serialNumberOffset + index + 1}</TableCell>
                                            <TableCell>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild><span className="cursor-default">{truncateText(story.title, 15)}</span></TooltipTrigger>
                                                        <TooltipContent><p>{story.title}</p></TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableCell>
                                            <TableCell>{story.author?.name || 'N/A'}</TableCell>
                                            <TableCell>{new Date(story.createdAt).toLocaleDateString('en-IN')}</TableCell>
                                            <TableCell className="text-right space-x-2 pr-6">
                                                <Button size="sm" variant="outline" onClick={() => handleOpenUpdateModal(story)}>Update</Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleOpenDeleteModal(story)}>Delete</Button>
                                                <Button size="sm" asChild><Link href={`/dashboard/stories/${story.id}`}>Manage Slides</Link></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            {storyFilter === 'today' ? "No stories created today." : "No stories found."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {/* Add Pagination Controls for Stories */}
                    {totalPages > 1 && (
                        <div className="mt-8">
                            <PaginationControls
                                totalPages={totalPages}
                                currentPage={currentPage}
                                baseUrl="/dashboard"
                                pageParamName="storyPage"
                            />
                        </div>
                    )}

                </section>
            </div>

            {/* Render the modals */}
            <UpdateStoryModal story={storyToUpdate} isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} />
            <DeleteStoryConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} />
        </>
    );
}