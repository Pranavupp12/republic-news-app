'use client';
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
export function LogoutButton() {
  return (<Button variant="outline" className="w-full" onClick={() => signOut({ callbackUrl: '/login' })}>Log Out</Button>);
}