import Member from "@models/member";
import { connectToDatabase } from "@utils/database";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const options: NextAuthOptions = {
  pages: {
    signIn: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "phoneNumber" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        await connectToDatabase();
        const { phoneNumber, password } = credentials;
        const user = await Member.findOne({ phoneNumber });
        if (!user) throw new Error("Phone Number not found");

        if (user && bcrypt.compareSync(password, user.password))
          return {
            id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            image: user.image,
          };
        else throw new Error("Wrong password");
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.phoneNumber = user.phoneNumber;
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        phoneNumber: token.phoneNumber,
      };
      return session;
    },
  },
};
