import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Email from "next-auth/providers/email";

import prisma from "@lib/db/prismadb";

const ONE_DAY = 86400;
const SEVEN_DAYS = 604800;

export const authOptions = (): NextAuthOptions => ({
    adapter: PrismaAdapter(prisma),
    providers: [
        Email({
            server: {
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT),
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            },
            from: process.env.EMAIL_FROM
            // async sendVerificationRequest({
            //     identifier: email,
            //     url,
            //     provider: { server, from }
            // }) {
            //     console.log(email, url, server, from);
            // }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token }: any) {
            const { user } = token;
            session = {
                ...session,
                user
            };
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.user = user;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: SEVEN_DAYS,
        updateAge: ONE_DAY
    }
});

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return NextAuth(req, res, authOptions());
}
