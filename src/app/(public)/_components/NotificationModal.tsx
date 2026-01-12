'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BellRing } from 'lucide-react';
import { subscribeUser } from '@/actions/notificationActions';

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function NotificationModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 1. Check if browser supports notifications
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    // 2. Check if we already have permission or if user already closed it
    const isPermissionGranted = Notification.permission === 'granted';
    const hasSeenModal = localStorage.getItem('notificationModalSeen');

    if (!isPermissionGranted && !hasSeenModal) {
      // Wait a few seconds before showing to not be annoying immediately
      const timer = setTimeout(() => setIsOpen(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = async () => {
    setIsOpen(false);
    localStorage.setItem('notificationModalSeen', 'true');

    try {
      console.log("🔵 FRONTEND: Starting subscription process...");
      
      const register = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      console.log("🔵 FRONTEND: Service Worker registered.");

      const readyRegistration = await navigator.serviceWorker.ready;
      console.log("🔵 FRONTEND: Service Worker Ready.");

      const permission = await Notification.requestPermission();
      console.log("🔵 FRONTEND: Permission status:", permission);
      
      if (permission === 'granted') {
        const subscription = await readyRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!)
        });

        // Log the raw subscription before sending
        console.log("🔵 FRONTEND: Generated Subscription:", JSON.stringify(subscription));

        const response = await subscribeUser(JSON.parse(JSON.stringify(subscription)));
        
        if (response.success) {
            console.log("✅ FRONTEND: Server confirmed save.");
        } else {
            console.error("❌ FRONTEND: Server failed to save:", response.error);
        }
      }
    } catch (error) {
      console.error("❌ FRONTEND: Failed to subscribe", error);
    }
  };
  
  const handleClose = () => {
    setIsOpen(false);
    // Remember that user closed it so we don't ask again (per new user rule)
    localStorage.setItem('notificationModalSeen', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-2">
            <BellRing className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center">Enable Notifications?</DialogTitle>
          <DialogDescription className="text-center">
            Get instant updates on breaking news, tech trends, and fresh stories. 
            We promise not to spam!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={handleClose}>
            No, thanks
          </Button>
          <Button onClick={handleSubscribe} className="bg-red-600 hover:bg-red-700">
            Yes, notify me
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}