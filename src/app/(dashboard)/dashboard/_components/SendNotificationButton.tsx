'use client';

import { useState } from "react"; // 1. Import useState
import { Button } from "@/components/ui/button";
import { sendNotificationToAll } from "@/actions/notificationActions";
import { toast } from "sonner";
import { Bell, Loader2 } from "lucide-react"; // 2. Import Loader2

export function SendNotificationButton({ article }: { article: any }) {
  const [isSending, setIsSending] = useState(false); // 3. Local state

  const handleSend = async () => {
    if (isSending) return; // Prevent double clicks
    setIsSending(true);

    const promise = sendNotificationToAll(
      article.title, 
      article.metaDescription || "Read this story on Republic News",
      `https://www.republicnews.us/article/${article.slug}`,
      article.imageUrl || undefined
    );

    toast.promise(promise, {
      loading: 'Sending notifications...',
      success: () => {
        setIsSending(false); // Stop spinner on success
        return 'Notifications sent!';
      },
      error: () => {
        setIsSending(false); // Stop spinner on error
        return 'Failed to send';
      }
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleSend} 
      disabled={isSending} // Disable while sending
      title="Send Push Notification"
    >
      {isSending ? (
        <Loader2 className="h-4 w-4 animate-spin" /> // Show spinner
      ) : (
        <Bell className="h-4 w-4" /> // Show bell
      )}
    </Button>
  );
}