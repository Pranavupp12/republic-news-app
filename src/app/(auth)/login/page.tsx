'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoggingIn(true);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", { 
      redirect: false, 
      email, 
      password 
    });

    if (result?.error) {
      toast.error("Login Failed", { description: "Invalid email or password." });
      setIsLoggingIn(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    // CHANGE: Added flex-col to stack the branding above the card
    <div className="flex h-screen w-full flex-col items-center justify-center px-4 gap-6">
      
      {/* --- NEW BRANDING SECTION --- */}
      <div className="flex flex-col items-center text-center space-y-1">
        <Link href="/" className="text-3xl font-bold font-heading tracking-tight hover:text-primary transition-colors">
          <span className="text-red-500">Republic</span> News
        </Link>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
          Admin Dashboard
        </p>
      </div>

      <Card className="mx-auto w-full max-w-md p-5 border border-black rounded-xl space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="team@republicnews.us" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}