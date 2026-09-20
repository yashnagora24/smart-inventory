import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { connectDB } from "./lib/db";
import User from "./models/User";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .toLowerCase()
          .trim();
        const password = String(credentials?.password ?? "");

        if (!email || !password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return null
        }

        const isPaswordValid = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPaswordValid) {
            return null;
        }

        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  }
});
