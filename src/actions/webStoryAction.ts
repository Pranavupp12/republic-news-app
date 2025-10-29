"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from 'cloudinary';
import Pusher from "pusher";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";   


// Configure Cloudinary 
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload an image file to Cloudinary
async function uploadImageToCloudinary(file: File) {
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
    const result = await cloudinary.uploader.upload(fileUri, {
        folder: 'web-stories', // Store in a separate folder
        fetch_format: 'auto',
        quality: 'auto',
    });
    return result.secure_url;
}


export async function createWebStory(formData: FormData) {
  // Get the current user's session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const title = formData.get('title') as string;
  const imageSource = formData.get('coverImageSource') as 'url' | 'upload';
  
  if (!title) {
    return { success: false, error: "Title is required." };
  }

  try {
    let coverImageUrl: string | undefined;

    if (imageSource === 'upload') {
        const coverImageFile = formData.get('coverImage') as File | null;
        if (!coverImageFile || coverImageFile.size === 0) {
            return { success: false, error: 'Cover image file is required for upload option.' };
        }
        coverImageUrl = await uploadImageToCloudinary(coverImageFile);
    } else {
        coverImageUrl = formData.get('coverImageUrl') as string | null ?? undefined;
        if (!coverImageUrl) {
            return { success: false, error: 'Cover image URL is required for URL option.' };
        }
    }
    
    await prisma.webStory.create({
      data: { title, coverImage: coverImageUrl, authorId: session.user.id, },
    });

    revalidatePath("/dashboard");
    revalidatePath("/web-stories");
   
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create story." };
  }
}

export async function addSlideToStory(formData: FormData) {
    const storyId = formData.get('storyId') as string;
    const caption = formData.get('caption') as string;
    const imageSource = formData.get('slideImageSource') as 'url' | 'upload';

    if (!storyId) {
        return { success: false, error: "Story ID is missing." };
    }

    try {
        let slideImageUrl: string | undefined;

        if (imageSource === 'upload') {
            const slideImageFile = formData.get('slideImage') as File | null;
            if (!slideImageFile || slideImageFile.size === 0) {
                return { success: false, error: 'Slide image file is required for upload option.' };
            }
            slideImageUrl = await uploadImageToCloudinary(slideImageFile);
        } else {
            slideImageUrl = formData.get('slideImageUrl') as string | null ?? undefined;
            if (!slideImageUrl) {
                return { success: false, error: 'Slide image URL is required for URL option.' };
            }
        }

        await prisma.storySlide.create({
            data: { storyId, imageUrl: slideImageUrl, caption },
        });

        revalidatePath(`/dashboard/stories/${storyId}`);
        revalidatePath(`/web-stories/${storyId}`);
        
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to add slide." };
    }
}

// updateWebStory
export async function updateWebStory(storyId: string, formData: FormData) {
  const title = formData.get('title') as string;
  const imageSource = formData.get('coverImageSource') as 'url' | 'upload';

  if (!title) {
    return { success: false, error: "Title is required." };
  }

  try {
    const dataToUpdate: { title: string; coverImage?: string } = { title };
    let newCoverImageUrl: string | undefined;

    // Check if the user wants to update the image
    if (imageSource === 'upload') {
        const newCoverImageFile = formData.get('coverImage') as File | null;
        // Only upload if a new file is actually provided
        if (newCoverImageFile && newCoverImageFile.size > 0) {
            newCoverImageUrl = await uploadImageToCloudinary(newCoverImageFile);
        }
    } else { // 'url' is the selected source
        const imageUrlFromForm = formData.get('coverImageUrl') as string | null;
        // Only update if a new URL is actually provided
        if (imageUrlFromForm) {
            newCoverImageUrl = imageUrlFromForm;
        }
    }

    // If a new image was provided (from either source), add it to the update object
    if (newCoverImageUrl) {
      dataToUpdate.coverImage = newCoverImageUrl;
    }

    await prisma.webStory.update({
      where: { id: storyId },
      data: dataToUpdate,
    });

    revalidatePath("/dashboard");
    revalidatePath("/web-stories"); 
   
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update story." };
  }
}

// --- NEW FUNCTION: deleteWebStory ---
export async function deleteWebStory(storyId: string) {
  try {
    await prisma.webStory.delete({
      where: { id: storyId },
    });
    revalidatePath("/dashboard");
    revalidatePath("/web-stories"); 

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete story." };
  }
}

// --- THIS IS THE UPDATED FUNCTION ---
export async function updateSlide(slideId: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    const caption = formData.get('caption') as string;
    const imageSource = formData.get('slideImageSource') as 'url' | 'upload';

    try {
        const dataToUpdate: { caption: string | null; imageUrl?: string } = {
            caption: caption || null,
        };
        let newImageUrl: string | undefined;

        // Check if the user wants to update the image
        if (imageSource === 'upload') {
            const slideImageFile = formData.get('slideImage') as File | null;
            if (slideImageFile && slideImageFile.size > 0) {
                newImageUrl = await uploadImageToCloudinary(slideImageFile);
            }
        } else if (imageSource === 'url') {
            const imageUrlFromForm = formData.get('slideImageUrl') as string | null;
            if (imageUrlFromForm) {
                newImageUrl = imageUrlFromForm;
            }
        }

        // If a new image was provided, add it to the update object
        if (newImageUrl) {
            dataToUpdate.imageUrl = newImageUrl;
        }

        const updatedSlide = await prisma.storySlide.update({
            where: { id: slideId },
            data: dataToUpdate,
        });

        revalidatePath(`/dashboard/stories/${updatedSlide.storyId}`);
        revalidatePath(`/web-stories/${updatedSlide.storyId}`);
        
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update slide." };
    }
}

// --- NEW ACTION: Delete Slide ---
export async function deleteSlide(slideId: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        const deletedSlide = await prisma.storySlide.delete({
            where: { id: slideId },
        });
        revalidatePath(`/dashboard/stories/${deletedSlide.storyId}`);

        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to delete slide." };
    }
}

