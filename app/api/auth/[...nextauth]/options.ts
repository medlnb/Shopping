import Member from "@models/member";
import { connectToDatabase } from "@utils/database";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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
            _id: user._id,
            name: user.name,
            phoneNumber: user.phoneNumber,
            image: user.image,
            isAdmin: user.admin,
          };
        else throw new Error("Wrong password");
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        const existingUser = await Member.findOne({ email: profile?.email });

        if (existingUser) {
          user._id = existingUser._id;
          user.name = existingUser.name;
          user.image = existingUser.image;
          user.isAdmin = existingUser.admin;
          if (existingUser.phoneNumber)
            user.phoneNumber = existingUser.phoneNumber;
          return true;
        } else {
          const newUser = await Member.create({
            name: profile?.name,
            email: profile?.email,
            image: profile?.picture,
          });
          user._id = newUser._id;
          user.isAdmin = newUser.admin;
          user.image = profile?.picture ?? "";
          user.name = profile?.name ?? "";
          user.phoneNumber = undefined;
          return true;
        }
      }
      return true;
    },
    async jwt({ token, trigger, user, session }) {
      if (trigger === "update") {
        if (session.name) token.name = session.name;
        if (session.phoneNumber) token.phoneNumber = session.phoneNumber;
        if (session.image) token.image = session.image;
      }
      if (user) {
        token._id = user._id;
        token.phoneNumber = user.phoneNumber;
        token.isAdmin = user.isAdmin;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        phoneNumber: token.phoneNumber,
        isAdmin: token.isAdmin,
        image: token.image,
        _id: token._id,
      };
      return session;
    },
  },
};
