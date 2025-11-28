'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
    } else {
      router.push("/dashboard");
    }
  };

  return (
   <>
    <div className="flex h-screen w-full items-center justify-center">
      <Card className="mx-auto w-full p-5 border border-gray-200 rounded-xl max-w-md">
        <div className="gap-2">
        <h2 className="text-center text-4xl font-semibold "><span className="text-red-500">Republic</span> news</h2>
        <p className="mb-2 text-center text-muted-foreground">admin dashboard</p>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
          
        </CardContent>
      </Card>
    </div>
  </>
  );
}