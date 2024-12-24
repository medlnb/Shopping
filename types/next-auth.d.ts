import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    name: string;
    phoneNumber: string;
    image: string;
  }

  interface Session {
    user: {
      name: string;
      phoneNumber: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name: string;
    phoneNumber: string;
    image?: string;
  }
}