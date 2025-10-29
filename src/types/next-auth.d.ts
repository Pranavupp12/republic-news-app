import { DefaultSession, DefaultUser } from "next-auth";



// Extend the default JWT type to include our custom 'id' property
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

// Extend the default Session and User types
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
  }

  /**
   * Represents the session object returned by `useSession`, `getSession`, etc.
   * We're extending the default session to include our custom user type,
   * which ensures that `session.user.id` is correctly typed.
   */
  interface Session extends DefaultSession {
    user: User;
  }
}