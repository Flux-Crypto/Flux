import { reset } from "@flux/prisma/src/helpers";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";
import { env } from "process";

import app from "../app";

type HTTPMethods =
    | "DELETE"
    | "delete"
    | "GET"
    | "get"
    | "HEAD"
    | "head"
    | "PATCH"
    | "patch"
    | "POST"
    | "post"
    | "PUT"
    | "put"
    | "OPTIONS"
    | "options";

export const testUser = {
    data: {
        email: "test@aurora.crypto",
        apiKey: "abcdef12345"
    }
};

let token: string;

export const callAPI = (
    fastifyApp: FastifyInstance,
    route: string,
    args?: {
        auth?: boolean;
        options?: {
            method: HTTPMethods;
            body?: string;
        };
    }
) => {
    if (args) {
        const { auth, options } = args;
        const useAuth = auth !== undefined ? auth : true;

        return fastifyApp.inject({
            url: `/api${route}`,
            headers: {
                "Content-Type": "application/json",
                Authorization: useAuth ? `Bearer ${token}` : ""
            },
            ...options
        });
    }

    return fastifyApp.inject({
        url: `/api${route}`,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });
};

const setupDB = async (prisma: PrismaClient) => {
    await reset(prisma);

    /* simulate an active session with a test user and fake JWT */
    const { id } = await prisma.user.create(testUser);

    const payload = {
        user: {
            id
        }
    };

    token = jwt.sign(payload, env.NEXTAUTH_SECRET);
};

const build = () => {
    const fastifyApp = app();

    beforeAll(async () => {
        await fastifyApp.listen();

        const { prisma } = fastifyApp;
        await setupDB(prisma);
    });

    afterAll(() => fastifyApp.close());

    return fastifyApp;
};

const fastifyApp = build();

export default fastifyApp;
