import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import axios from "axios";

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  // adapter
  // adapter: MongoDBAdapter(client) as Adapter,

  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "credentials",
      async authorize(credentials) {
        const email = credentials.email;
        const password = credentials.password as string;

        if (!email || !password) {
          throw new Error("fill credentials");
        }
        const promise = await axios.get(
          process.env.NEXT_PUBLIC_SERVER_URL + "/api/user",
          {
            params: { email: email },
          }
        );
        const user = promise.data.data;
        if (!user) {
          throw new Error("user not found");
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
          throw new Error("Invalid passwords");
        }
        return user;
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      const promise = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + "/api/user",
        {
          params: { email: session.user.email },
        }
      );
      const userData = promise.data.data;
      user = userData;
      session.user.id = userData._id;
      session.user.emailVerified = user.emailVerified;
      // When creating a profile with Google, we need to provide a user role by default
      // if we want to implement roles, as it is not given by default
      session.user.role = userData.role;

      return session;
    },

    async jwt({ token }) {
      return token;
    },
  },

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    // Set it as jwt instead of database
    strategy: "jwt",
  },
});
