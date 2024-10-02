import axios from "axios";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [],
  callbacks: {
    async session({ session }) {
      const promise = await axios.get(
        process.env.NEXT_PUBLIC_SERVER_URL + "/api/user",
        {
          params: { email: session.user.email },
        }
      );
      const userData = promise.data.data;
      session.user.role = userData.role;
      session.user.id = userData._id;
      return session;
    },
  },
} satisfies NextAuthConfig;
