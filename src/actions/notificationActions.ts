'use server';

import { prisma } from "@/lib/prisma";
import webPush from 'web-push';

// Configure web-push with your keys
webPush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:admin@republicnews.us',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

// 1. SUBSCRIBE ACTION (Keep this as is, it's working)
export async function subscribeUser(sub: any) {
  console.log("🔥 SERVER: Received Subscription Request:", JSON.stringify(sub, null, 2));

  if (!sub || !sub.keys || !sub.keys.p256dh || !sub.keys.auth) {
    console.error("❌ SERVER: Invalid subscription object received. Missing keys.");
    return { success: false, error: "Invalid keys" };
  }

  try {
    const newSub = await prisma.pushSubscriber.create({
      data: {
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      }
    });
    console.log("✅ SERVER: Successfully saved to DB:", newSub.id);
    return { success: true };
  } catch (error: any) {
    console.error("❌ SERVER DB ERROR:", error.message);
    if (error.code === 'P2002') {
       console.log("ℹ️ User already exists.");
       return { success: true };
    }
    return { success: false, error: error.message }; 
  }
}

// 2. SEND NOTIFICATION ACTION (Updated with Logs)
export async function sendNotificationToAll(title: string, body: string, url: string,imageUrl?: string) {
  console.log("🚀 SERVER: Starting to send notifications...");
  
  try {
    const subscribers = await prisma.pushSubscriber.findMany();
    console.log(`📊 SERVER: Found ${subscribers.length} subscribers in DB.`);

    if (subscribers.length === 0) {
      console.log("⚠️ SERVER: No subscribers found. Aborting.");
      return { success: false, error: "No subscribers" };
    }

    const payload = JSON.stringify({ title, body, url,image: imageUrl });

    // Send to all subscribers in parallel
    const promises = subscribers.map(sub => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      return webPush.sendNotification(pushSubscription, payload)
        .then((response) => {
           // LOG SUCCESS HERE
           console.log(`✅ SERVER: Sent to ${sub.id} | Status: ${response.statusCode}`);
        })
        .catch(error => {
          console.error(`❌ SERVER: Failed to send to ${sub.id}:`, error.statusCode);
          
          // If 410 (Gone) or 404 (Not Found), the user removed the subscription
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log(`🗑️ SERVER: Removing invalid subscription: ${sub.id}`);
            prisma.pushSubscriber.delete({ where: { id: sub.id } }).catch(console.error);
          }
        });
    });

    await Promise.all(promises);
    console.log("🏁 SERVER: Notification process finished.");
    return { success: true };

  } catch (error) {
    console.error("❌ SERVER: Critical error in sendNotificationToAll:", error);
    return { success: false, error: "Server error" };
  }
}

// 3. SEND DIGEST / BATCH NOTIFICATION
export async function sendDigestNotification(
  articleIds: string[], 
  customTitle: string, 
  customBody: string
) {
  try {
    const subscribers = await prisma.pushSubscriber.findMany();
    
    if (subscribers.length === 0) {
      return { success: false, error: "No subscribers found" };
    }

    // A digest usually points to the homepage since it covers multiple topics
    const url = "https://www.republicnews.us"; 
    const payload = JSON.stringify({ title: customTitle, body: customBody, url });

    // Send in parallel
    const promises = subscribers.map(sub => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth }
      };
      return webPush.sendNotification(pushSubscription, payload).catch(() => {});
    });

    await Promise.all(promises);

    // LOG THE HISTORY
    await prisma.notificationLog.create({
      data: {
        title: customTitle,
        body: customBody,
        recipientCount: subscribers.length,
        articleIds: articleIds
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Batch Send Error:", error);
    return { success: false, error: error.message };
  }
}

// 4. GET NOTIFICATION HISTORY
export async function getNotificationHistory() {
  try {
    const logs = await prisma.notificationLog.findMany({
      orderBy: { sentAt: 'desc' },
      take: 20 // Get last 20 batches
    });
    return { success: true, logs };
  } catch (error) {
    return { success: false, error: "Failed to fetch logs" };
  }
}