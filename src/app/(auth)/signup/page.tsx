'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast} from "sonner"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handleSignUp } from "@/actions/authActions";
import { useState } from 'react';
import { Loader2 } from 'lucide-react';


export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    try {
      const result = await handleSignUp(formData);
      if (result.success) {
        toast.success( "Account Created",{ description: "Please log in." });
        router.push("/login");
      } else {
        // Note: You had toast() here, changed to toast.error
        toast.error( "Error",{ description: result.error });
      }
    } catch (error) {
      console.error("Signup Submit Error:", error);
      toast.error("Error", { description: "An unexpected error occurred." });
    } finally {
      setIsLoading(false); // <-- Set loading false
    }
  };
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader><CardTitle className="text-xl">Sign Up</CardTitle><CardDescription>Enter info to create an account</CardDescription></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required /></div>
          <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required /></div>
          <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required /></div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create an account'
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">Already have an account? <Link href="/login" className="underline">Sign in</Link></div>
      </CardContent>
    </Card>
  );
}