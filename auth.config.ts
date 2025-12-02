// auth.config.ts
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text", required: true },
        password: { label: "Password", type: "password", required: true },
      },

      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        // temp user (replace with db lookup)
        if (
          credentials.username === "admin" &&
          credentials.password === "admin"
        ) {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@helpstudy.com",
            token: "admin-jwt-token-from-server",
          }
        }

        return null
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.token = user.token
      }
      return token
    },

    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string
      }
      session.token = token.token
      return session
    },
  },

  session: {
    strategy: "jwt" as const,
  },

  pages: {
    signIn: "/login",
  },
}
