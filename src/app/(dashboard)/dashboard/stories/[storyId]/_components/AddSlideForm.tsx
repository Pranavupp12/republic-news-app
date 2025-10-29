'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { addSlideToStory } from '@/actions/webStoryAction';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';

interface AddSlideFormProps {
    storyId: string;
    storyTitle: string;
}

export function AddSlideForm({ storyId, storyTitle }: AddSlideFormProps) {
    const [imageSource, setImageSource] = useState<'url' | 'upload'>('upload');
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true); 
        const form = event.currentTarget;
        const formData = new FormData(form);
        const result = await addSlideToStory(formData);
        if (result.success) {
            toast.success("Slide added successfully!");
            form.reset();
            setImageSource('upload');
        } else {
            toast.error("Failed to add slide", { description: result.error });
        }
        setIsSubmitting(false); 
    };
    
    return (
        <Card>
            <CardHeader><CardTitle>Add New Slide to &quot;{storyTitle}&quot;</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="hidden" name="storyId" value={storyId} />

                    <div className="space-y-2">
                        <Label>Slide Image Source</Label>
                        <RadioGroup name="slideImageSource" value={imageSource} onValueChange={(v: 'url' | 'upload') => setImageSource(v)} className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2"><RadioGroupItem value="url" id="rs-url" /><Label htmlFor="rs-url">URL</Label></div>
                            <div className="flex items-center space-x-2"><RadioGroupItem value="upload" id="rs-upload" /><Label htmlFor="rs-upload">Upload</Label></div>
                        </RadioGroup>
                    </div>

                    {imageSource === 'url' ? (
                        <div className="space-y-2"><Label>Image URL</Label><Input name="slideImageUrl" placeholder="https://example.com/image.jpg"/></div>
                    ) : (
                        <div className="space-y-2"><Label>Upload Image</Label><Input name="slideImage" type="file" accept="image/*"/></div>
                    )}

                    <div className="space-y-2"><Label>Caption (Optional)</Label><Input name="caption" /></div>
                    
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Adding...' : 'Add Slide'}
                    </Button>

                </form>
            </CardContent>
        </Card>
    );
}