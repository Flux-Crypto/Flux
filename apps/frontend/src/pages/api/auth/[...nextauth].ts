import * as Prisma from "@aurora/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import Email from "next-auth/providers/email";

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

export const authOptions = (
    req: NextApiRequest,
    prisma: PrismaClient
): NextAuthOptions => ({
    adapter: PrismaAdapter(prisma),
    providers: [
        Email({
            server: {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD
                }
            },
            from: process.env.SMTP_FROM
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
        },
        async signIn({ user, email }) {
            console.log(user);
            // triggered by verification request flow
            if (email?.verificationRequest) {
                console.log(email);
                // return false;
            }
            console.log("registering user");
            console.log({ email: user.email });
            // registering user
            const res = await fetch("http://localhost:8000/api/v1/users", {
                method: "POST",
                body: JSON.stringify({ email: user.email }),
                headers: {
                    "Content-Type": "application/json",
                    accept: "application/json"
                }
            });
            console.log(res);
            // const foundUser = await res.json();
            // console.log(foundUser);
            return false;
        }
    },
    session: {
        strategy: "jwt",
        maxAge: SEVEN_DAYS,
        updateAge: ONE_DAY
    }
});

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    const { prisma } = await Prisma.createContext();
    return NextAuth(req, res, authOptions(req, prisma));
}
