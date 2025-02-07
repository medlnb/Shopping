import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    name: string;
    phoneNumber: string;
    image: string;
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      name: string;
      phoneNumber: string;
      image?: string;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name: string;
    phoneNumber: string;
    image?: string;
    isAdmin?: boolean;
  }
}
