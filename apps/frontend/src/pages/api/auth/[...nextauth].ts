import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions, User } from "next-auth";
import NextAuth from "next-auth/next";
import Email from "next-auth/providers/email";

import prisma from "../../../lib/db/prismadb";

// Sign in
const ONE_DAY = 86400;
const SEVEN_DAYS = 604800;
// async function authorize(credentials: { email: string } | undefined) {
//     if (!credentials) {
//         throw new Error("Credentials must be provided.");
//     }

//     // call api for user
//     const res = await fetch("http://localhost:3000/api/v1/users", {
//         method: "POST",
//         body: JSON.stringify(credentials),
//         headers: { "Content-Type": "application/json" }
//     });
//     const user = await res.json();

//     return {
//         id: user.id,
//         email: user.email,
//         name: user.name,
//         accountVerified: user.accountVerified,
//         emailVerified: user.emailVerified,
//         image: user.image,
//         role: user.role
//     };
// }

export const authOptions = (): NextAuthOptions => ({
    adapter: PrismaAdapter(prisma),
    providers: [
        Email({
            server: {
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: "prince.schumm84@ethereal.email",
                    pass: "X5gZW8RbHtXzcmePvJ"
                }
            },
            from: "prince.schumm84@ethereal.email"
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
