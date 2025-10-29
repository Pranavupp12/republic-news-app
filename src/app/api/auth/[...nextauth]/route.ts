import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// The NextAuth function returns a handler that can process GET and POST requests.
const handler = NextAuth(authOptions);

// We export the handler for both GET and POST methods.
// This is the required syntax for API Routes in the Next.js App Router.
export { handler as GET, handler as POST };