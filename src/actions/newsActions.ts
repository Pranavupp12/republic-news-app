"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from 'cloudinary';

// This configures Cloudinary with the credentials from your .env.local file
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
        folder: 'news-portal',
        fetch_format: 'auto',
        quality: 'auto',
    });
    return result.secure_url;
}

//  createArticle ACTION
export async function createArticle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    // We now extract data using formData.get()
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    const imageSource = formData.get('imageSource') as 'url' | 'upload';
    
    // --- NEW FIELDS ---
    const slug = formData.get('slug') as string;
    const metaTitle = formData.get('metaTitle') as string | null;
    const metaDescription = formData.get('metaDescription') as string | null;
    const metaKeywords = formData.get('metaKeywords') as string | null;
    // ------------------
    
    let imageUrl: string | undefined;

    // Logic to handle either a file upload or a URL string
    if (imageSource === 'upload') {
        const imageFile = formData.get('imageFile') as File | null;
        if (!imageFile || imageFile.size === 0) {
            return { success: false, error: 'Image file is required for the upload option.' };
        }
        imageUrl = await uploadImageToCloudinary(imageFile);
    } else {
        imageUrl = formData.get('imageUrl') as string | null ?? undefined;
        if (!imageUrl) {
            return { success: false, error: 'Image URL is required for the URL option.' };
        }
    }

    // CHANGED: Added slug to validation
    if (!title || !category || !content || !imageUrl || !slug) {
        return { success: false, error: 'Title, Category, Content, Image, and Slug are required.' };
    }

    await prisma.article.create({
      data: {
        title,
        content,
        imageUrl,
        category,
        slug: slug, // NEW
        // Use `|| null` to convert empty strings "" to null for the database
        metaTitle: metaTitle || null, // NEW
        metaDescription: metaDescription || null, // NEW
        metaKeywords: metaKeywords || null, // NEW
        authorId: session.user.id,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true };

  } catch (error) {
    console.error('Create article error:', error);
    // CHANGED: Added a check for unique constraint error (slug)
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('slug')) {
        return { success: false, error: "This URL slug is already taken. Please change it." };
    }
    return { success: false, error: "Failed to create article." };
  }
}

//  delete action
export async function deleteArticle(articleId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, error: "Not authenticated" };
  try {
    await prisma.article.delete({ where: { id: articleId } });
    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete article." };
  }
}

//  Update Action
export async function updateArticle(articleId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const content = formData.get('content') as string;
    const imageSource = formData.get('imageSource') as 'url' | 'upload';

    // --- NEW FIELDS ---
    const slug = formData.get('slug') as string;
    const metaTitle = formData.get('metaTitle') as string | null;
    const metaDescription = formData.get('metaDescription') as string | null;
    const metaKeywords = formData.get('metaKeywords') as string | null;
    // ------------------

    // CHANGED: Added slug to validation
    if (!title || !category || !content || !slug) {
      return { success: false, error: "Title, category, content, and slug are required." };
    }

    let newImageUrl: string | undefined;

    // Check if the user wants to update the image
    if (imageSource === 'upload') {
        const imageFile = formData.get('imageFile') as File | null;
        // Only upload if a new file is actually provided
        if (imageFile && imageFile.size > 0) {
            newImageUrl = await uploadImageToCloudinary(imageFile);
        }
    } else { // 'url' is the selected source
        const imageUrlFromForm = formData.get('imageUrl') as string | null;
        // Only update if a new URL is actually provided
        if (imageUrlFromForm) {
            newImageUrl = imageUrlFromForm;
        }
    }

    // Prepare the data for the database update
    // CHANGED: Defined a more complete data object type
    const dataToUpdate: {
      title: string;
      category: string;
      content: string;
      slug: string; // NEW
      metaTitle: string | null; // NEW
      metaDescription: string | null; // NEW
      metaKeywords: string | null; // NEW
      imageUrl?: string;
    } = {
      title,
      category,
      content,
      slug, // NEW
      metaTitle: metaTitle || null, // NEW
      metaDescription: metaDescription || null, // NEW
      metaKeywords: metaKeywords || null, // NEW
    };

    // If a new image was provided, add it to the update object
    if (newImageUrl) {
      dataToUpdate.imageUrl = newImageUrl;
    }

    await prisma.article.update({
      where: { id: articleId },
      data: dataToUpdate,
    });

    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true };

  } catch (error) {
    console.error("Update article error:", error);
    // CHANGED: Added a check for unique constraint error (slug)
    if ((error as any).code === 'P2002' && (error as any).meta?.target?.includes('slug')) {
        return { success: false, error: "This URL slug is already taken. Please change it." };
    }
    return { success: false, error: "Failed to update the article." };
  }
}

// Toggle Featured Status Action
export async function toggleFeaturedStatus(articleId: string, isFeatured: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  if (isFeatured === true) {

    // Rule 1: Check if it's already trending
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { isTrending: true, createdAt: true },
    });
    if (article?.isTrending) {
      return { success: false, error: "A trending article cannot be set to featured." };
    }
  
    // Rule 2: Check if the article was created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (article && article.createdAt >= today) {
      return { success: false, error: "Today's articles cannot be featured." };
    }
    
    // Rule 3: Check the max featured count
    const featuredCount = await prisma.article.count({ where: { isFeatured: true } });
    if (featuredCount >= 7) {
      return { success: false, error: "Cannot feature more than 7 articles." };
    }
  }

  try {
    await prisma.article.update({
      where: { id: articleId },
      data: { isFeatured: isFeatured },
    });

    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update featured status." };
  }
}

// NEW: Toggle Trending Status Action
export async function toggleTrendingStatus(
  articleId: string, 
  isTrending: boolean, 
  trendingTopic?: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  // Enforce the new rules
    if (isTrending === true) {
    // Combine the fetch for both checks
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { isFeatured: true, createdAt: true },
    });

    // Rule 1: Check if it's already featured
    if (article?.isFeatured) {
      return { success: false, error: "A featured article cannot be set to trending." };
    }

    // Rule 2: Check if the article was created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (article && article.createdAt >= today) {
      return { success: false, error: "Today's articles cannot be set as trending." };
    }

    // Rule 3: Check the max trending count
    const trendingCount = await prisma.article.count({ where: { isTrending: true } });
    if (trendingCount >= 7) {
      return { success: false, error: "Cannot have more than 7 trending articles." };
    }

    // Rule 4: Ensure a topic is provided
    if (!trendingTopic) {
        return { success: false, error: "A trending topic is required." };
    }
  }


  try {
    await prisma.article.update({
      where: { id: articleId },
      data: { 
        isTrending: isTrending,
        // Set the topic, or clear it if un-trending
        trendingTopic: isTrending ? trendingTopic : null,
       },
    });

    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update trending status." };
  }
}



