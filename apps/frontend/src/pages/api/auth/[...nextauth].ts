import { PrismaAdapter } from "@next-auth/prisma-adapter";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { NextApiRequest, NextApiResponse } from "next";
import { NextAuthOptions } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";
import NextAuth from "next-auth/next";
import Email from "next-auth/providers/email";

import prisma from "@lib/db/prismadb";
import { SessionParams, SignInParams } from "@src/lib/types/auth";

const ONE_DAY = 86400;
const SEVEN_DAYS = 604800;

const EmailProvider = Email({
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
        user: _.pick(user, ["email", "userId", "firstName", "lastName"]),
        authToken
    };
};

const jwtCallback = async ({ token, user }: any) => ({ ...token, user });

const signIn = async ({ user }: SignInParams) => {
    const { email } = user as AdapterUser;

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
    providers: [EmailProvider],
    pages: {
        signIn: "/authentication",
        signOut: "/signout",
        error: "/auth/error", // error code passed in query string as ?error=
        verifyRequest: "/auth/verify-request", // used for check email message
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
        maxAge: SEVEN_DAYS,
        updateAge: ONE_DAY
    }
});

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return NextAuth(req, res, authOptions());
}
