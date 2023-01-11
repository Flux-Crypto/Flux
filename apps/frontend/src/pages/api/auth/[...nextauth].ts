import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt, { verify } from "jsonwebtoken";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import Email from "next-auth/providers/email";

import prisma from "@lib/db/prismadb";
import { SessionParams, SignInParams } from "@lib/types/auth";

export const UPDATE_AGE = 86400; // 1 day
export const MAX_AGE = 604800; // 7 days

const CredentialsProvider = Credentials({
    id: "refresh-session",
    name: "refresh-session",
    credentials: {},
    async authorize(credentials: any) {
        const { token, refresh } = credentials;
        try {
            const valid = await verify(token, process.env.NEXTAUTH_SECRET);
            if (!valid) return null;
            const response = await fetch(`http://localhost:8000/api/v1/user`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            const user = (await response.json()).data;
            return { ...user, refresh };
        } catch (e) {
            console.log(e);
        }
        return null;
    }
});

const EmailProvider = Email({
    id: "email",
    name: "email",
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
});

const session = async ({ session: sessionObj, token }: SessionParams) => {
    // TODO: type this
    const { user } = token;
    const authToken = jwt.sign(token, process.env.NEXTAUTH_SECRET);

    return {
        ...sessionObj,
        user: _.pick(user, ["email", "id", "firstName", "lastName"]),
        authToken
    };
};

const jwtCallback = async ({ token, user }: any) =>
    user ? { ...token, user } : token;
const signIn = async ({ user, credentials }: SignInParams) => {
    const { email } = user as AdapterUser;

    if (credentials?.refresh) {
        return true;
    }

    const response = await fetch(`http://localhost:8000/api/v1/users`, {
        method: "POST",
        body: JSON.stringify({ email, firstName: "", lastName: "" }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    return response.ok;
};

export const authOptions = (): NextAuthOptions => ({
    adapter: PrismaAdapter(prisma),
    providers: [EmailProvider, CredentialsProvider],
    pages: {
        signIn: "/authentication",
        // signOut: "/signout",
        // error: "/auth/error", // error code passed in query string as ?error=
        verifyRequest: "/verify", // used for check email message
        newUser: "/onboard" // new users will be directed here on first sign in (leave the property out if not of interest)
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        session,
        jwt: jwtCallback,
        signIn
    },
    session: {
        strategy: "jwt",
        maxAge: MAX_AGE,
        updateAge: UPDATE_AGE
    }
});

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return NextAuth(req, res, authOptions());
}
