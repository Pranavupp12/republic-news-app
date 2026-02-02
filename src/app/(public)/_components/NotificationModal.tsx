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
      const timer = setTimeout(() => setIsOpen(true), 5000); // Increased slightly to 5s for better UX
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
    // Remember that user closed it so we don't ask again
    localStorage.setItem('notificationModalSeen', 'true');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden rounded-none border-t-4 border-t-red-600 bg-white shadow-xl">
        
        <DialogHeader className="p-8 pb-2 items-center">
          {/* Sharp Icon Container */}
          <div className="bg-red-50 p-3 w-fit mb-4 flex items-center justify-center border border-red-100">
            <BellRing className="h-6 w-6 text-red-700" />
          </div>
          
          <DialogTitle className="text-xl font-bold text-center font-heading tracking-tight text-neutral-900">
            Stay Ahead of the Story
          </DialogTitle>
          
          <DialogDescription className="text-center text-neutral-500 mt-2 leading-relaxed text-sm">
            Enable notifications to receive real-time updates on breaking news, in-depth analysis, and essential daily briefings.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="p-8 pt-6 flex-col sm:flex-row gap-3 sm:justify-center w-full">
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="rounded-none border-neutral-300 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 w-full sm:w-auto font-medium"
          >
            Maybe Later
          </Button>
          <Button 
            onClick={handleSubscribe} 
            className="rounded-none bg-red-600 hover:bg-red-700 hover:text-white text-white w-full sm:w-auto font-medium shadow-sm"
          >
            Enable Notifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}