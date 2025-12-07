import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      guestId?: string;
      email?: string;
      name?: string;
      image?: string;
    };
  }
}
