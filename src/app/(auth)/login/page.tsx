'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {
      const result = await signIn("credentials", { redirect: false, email, password });
      
      if (result?.error) {
        // Note: You had toast.success here, changed to toast.error
        toast.error("Login Failed", { description: "Invalid email or password." });
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login Submit Error:", error);
      toast.error("Error", { description: "An unexpected error occurred." });
    } finally {
      setIsLoading(false); // <-- Set loading false
    }
  };
  return (
    <Card className="mx-auto w-full max-w-md p-4 rounded-xl">
      <CardHeader><CardTitle className="text-2xl">Login</CardTitle><CardDescription>Enter email to login</CardDescription></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
          <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required /></div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">Don&apos;t have an account? <Link href="/signup" className="underline">Sign up</Link></div>
      </CardContent>
    </Card>
  );
}