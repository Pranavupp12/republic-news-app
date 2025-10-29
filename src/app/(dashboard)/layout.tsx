import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardHeader } from "./_components/DashboardHeader";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard", // Optional: It's good practice to title your dashboard
  robots: {
    index: false, //  Tell search engines *not* to index this page
    follow: false, // Tell search engines *not* to follow links from this page
    nocache: true, // Ask search engines not to cache this page
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login?callbackUrl=/dashboard");
  }
  return (
    <div className="flex flex-col min-h-screen" >
      <DashboardHeader user={session.user} />
      <main className="flex justify-center w-full py-8" >{children}</main>
    </div>
  );
}