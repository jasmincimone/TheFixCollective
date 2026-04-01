import type { AuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { ROLES, toVendorStatus } from "@/lib/roles";

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.trim().toLowerCase() },
          include: { vendorProfile: true },
        });
        if (!user?.passwordHash) return null;
        const ok = verifyPassword(credentials.password, user.passwordHash);
        if (!ok) return null;
        const role = user.role === ROLES.ADMIN || user.role === ROLES.VENDOR || user.role === ROLES.CUSTOMER
          ? user.role
          : ROLES.CUSTOMER;
        const authUser: User = {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          role,
          vendorStatus: toVendorStatus(user.vendorProfile?.status),
        };
        return authUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.role = user.role ?? ROLES.CUSTOMER;
        token.vendorStatus = toVendorStatus(user.vendorStatus as string | null | undefined);
      } else if (token.id) {
        // Keep JWT in sync with DB (e.g. admin role changes, vendor approval) — token.role alone would stay stale.
        const u = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { vendorProfile: true },
        });
        if (u) {
          token.role =
            u.role === ROLES.ADMIN || u.role === ROLES.VENDOR || u.role === ROLES.CUSTOMER
              ? u.role
              : ROLES.CUSTOMER;
          token.vendorStatus = toVendorStatus(u.vendorProfile?.status);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = (token.role as typeof ROLES[keyof typeof ROLES]) ?? ROLES.CUSTOMER;
        session.user.vendorStatus = toVendorStatus(token.vendorStatus as string | null | undefined);
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt" as const, maxAge: 30 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};
