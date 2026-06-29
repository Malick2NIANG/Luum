import 'dotenv/config';
import { prismaAdapter } from '@better-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { bearer } from 'better-auth/plugins/bearer';

const prisma = new PrismaClient();

const SESSION_EXPIRES_IN_SECONDS = 60 * 60 * 24 * 30; // 30 days

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: SESSION_EXPIRES_IN_SECONDS,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.FRONTEND_URL ?? 'http://localhost:3001'],
  user: {
    fields: {
      // schema.prisma uses `avatar`, better-auth's canonical field is `image`
      image: 'avatar',
    },
  },
  account: {
    fields: {
      // schema.prisma names these the other way around
      providerId: 'provider',
      accountId: 'providerId',
    },
  },
  // Allows mobile/native clients to send `Authorization: Bearer <token>`
  // instead of relying on cookies.
  plugins: [bearer()],
});

export type Auth = typeof auth;
export type SessionUser = NonNullable<
  Awaited<ReturnType<typeof auth.api.getSession>>
>['user'];
