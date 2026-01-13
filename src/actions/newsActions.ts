"use server";

import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from 'cloudinary';
import { sendNotificationToAll } from "@/actions/notificationActions";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImageToCloudinary(file: File) {
    const fileBuffer = await file.arrayBuffer();
    const mime = file.type;
    const encoding = 'base64';
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

    const result = await cloudinary.uploader.upload(fileUri, {
        folder: 'news-portal',
        format: 'webp',
        fetch_format: 'auto',
        quality: 'auto',
    });
    return result.secure_url;
}

export async function createArticle(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageSource = formData.get('imageSource') as 'url' | 'upload';
    
    // --- UPDATED: GET ALL CATEGORIES ---
    const categories = formData.getAll('category') as string[]; 

    const slug = formData.get('slug') as string;
    const metaTitle = formData.get('metaTitle') as string | null;
    const metaDescription = formData.get('metaDescription') as string | null;
    const metaKeywords = formData.get('metaKeywords') as string | null;
    
    let imageUrl: string | undefined;

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

    if (!title || categories.length === 0 || !content || !imageUrl || !slug) {
        return { success: false, error: 'Title, at least one Category, Content, Image, and Slug are required.' };
    }

    const article = await prisma.article.create({
      data: {
        title,
        content,
        imageUrl,
        category: categories, // --- UPDATED: Save array
        slug, 
        metaTitle: metaTitle || null, 
        metaDescription: metaDescription || null, 
        metaKeywords: metaKeywords || null, 
        authorId: session.user.id,
      },
    });

    // Send Notification automatically
    void sendNotificationToAll(
      article.title, 
      "Breaking News: " + article.title,
      `https://www.republicnews.us/article/${article.slug}`,
      article.imageUrl
    ).catch(console.error);

    revalidatePath("/dashboard");
    revalidatePath("/");

    return { success: true };

  } catch (error: any) {
    console.error('Create article error:', error);
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return { success: false, error: "This URL slug is already taken. Please change it." };
    }
    return { success: false, error: "Failed to create article." };
  }
}

export async function deleteArticle(articleId: string) {
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, error: "Not authenticated" };
  try {
    await prisma.article.delete({ where: { id: articleId } });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("delete article error:", error);
    return { success: false, error: "Failed to delete article." };
  }
}

export async function updateArticle(articleId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageSource = formData.get('imageSource') as 'url' | 'upload';

    // --- UPDATED: GET ALL CATEGORIES ---
    const categories = formData.getAll('category') as string[];

    const slug = formData.get('slug') as string;
    const metaTitle = formData.get('metaTitle') as string | null;
    const metaDescription = formData.get('metaDescription') as string | null;
    const metaKeywords = formData.get('metaKeywords') as string | null;

    if (!title || categories.length === 0 || !content || !slug) {
      return { success: false, error: "Title, at least one category, content, and slug are required." };
    }

    let newImageUrl: string | undefined;

    if (imageSource === 'upload') {
        const imageFile = formData.get('imageFile') as File | null;
        if (imageFile && imageFile.size > 0) {
            newImageUrl = await uploadImageToCloudinary(imageFile);
        }
    } else { 
        const imageUrlFromForm = formData.get('imageUrl') as string | null;
        if (imageUrlFromForm) {
            newImageUrl = imageUrlFromForm;
        }
    }

    const dataToUpdate: any = {
      title,
      category: categories, // --- UPDATED: Save array
      content,
      slug, 
      metaTitle: metaTitle || null, 
      metaDescription: metaDescription || null, 
      metaKeywords: metaKeywords || null, 
    };

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

  } catch (error: any) {
    console.error("Update article error:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return { success: false, error: "This URL slug is already taken. Please change it." };
    }
    return { success: false, error: "Failed to update the article." };
  }
}

// ... toggleFeaturedStatus, toggleTrendingStatus, and uploadEditorImage remain the same ...
// (Include them below exactly as they were)

export async function toggleFeaturedStatus(articleId: string, isFeatured: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  if (isFeatured === true) {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { isTrending: true, createdAt: true },
    });

    if (!article) return { success: false, error: "Article not found." };
    if (article.isTrending) return { success: false, error: "A trending article cannot be set to featured." };

    // --- NEW CHECK: Is this article in the "Latest Headlines" (Top 4)? ---
    // We fetch the latest 4 articles just like the homepage does.
    const latestHeadlines = await prisma.article.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: { id: true }
    });
    
    // Check if the current article ID is in that list
    const isInHeadlines = latestHeadlines.some(h => h.id === articleId);
    
    if (isInHeadlines) {
      return { success: false, error: "This article is currently a Latest Headline and cannot be featured yet." };
    }
    // ---------------------------------------------------------------------

    const featuredCount = await prisma.article.count({ where: { isFeatured: true } });
    if (featuredCount >= 7) return { success: false, error: "Cannot feature more than 7 articles." };
  }

  try {
    await prisma.article.update({ where: { id: articleId }, data: { isFeatured: isFeatured } });
    revalidatePath("/dashboard");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update featured status." };
  }
}

export async function toggleTrendingStatus(articleId: string, isTrending: boolean, trendingTopic?: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return { success: false, error: "Not authenticated" };

    if (isTrending === true) {
        const article = await prisma.article.findUnique({ 
            where: { id: articleId }, 
            select: { isFeatured: true, createdAt: true } 
        });

        if (!article) return { success: false, error: "Article not found." };
        if (article.isFeatured) return { success: false, error: "A featured article cannot be set to trending." };

        // --- NEW CHECK: Is this article in the "Latest Headlines" (Top 4)? ---
        const latestHeadlines = await prisma.article.findMany({
            take: 4,
            orderBy: { createdAt: 'desc' },
            select: { id: true }
        });
        
        const isInHeadlines = latestHeadlines.some(h => h.id === articleId);
        
        if (isInHeadlines) {
            return { success: false, error: "This article is currently a Latest Headline and cannot be set as trending." };
        }
        // ---------------------------------------------------------------------

        const trendingCount = await prisma.article.count({ where: { isTrending: true } });
        if (trendingCount >= 7) return { success: false, error: "Cannot have more than 7 trending articles." };

        if (!trendingTopic) return { success: false, error: "A trending topic is required." };
    }

    try {
        await prisma.article.update({
            where: { id: articleId },
            data: { isTrending: isTrending, trendingTopic: isTrending ? trendingTopic : null },
        });
        revalidatePath("/dashboard");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update trending status." };
    }
}

export async function uploadEditorImage(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  try {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) return { success: false, error: "No file provided" };
    const url = await uploadImageToCloudinary(file);
    return { success: true, url };
  } catch (error) {
    return { success: false, error: "Upload failed" };
  }
}