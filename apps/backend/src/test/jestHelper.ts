import { reset } from "@flux/prisma/src/helpers";
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
        id: "63c24e670b17d5516e0cb49c",
        email: "test@aurora.crypto"
    }
};

const {
    data: { id }
} = testUser;
const payload = {
    user: {
        id
    }
};

export const token = jwt.sign(payload, env.NEXTAUTH_SECRET);

// TODO: add an option for testUser with apiKey?

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

const build = () => {
    const fastifyApp = app();

    beforeAll(async () => {
        await fastifyApp.listen();

        const { prisma } = fastifyApp;
        await reset(prisma);
        /* simulate an active session with a test user and fake JWT */
        await prisma.user.create(testUser);
    });

    beforeEach(async () => {
        const { prisma } = fastifyApp;
        await reset(prisma);
        /* simulate an active session with a test user and fake JWT */
        await prisma.user.create(testUser);
    });

    afterAll(async () => {
        const { prisma } = fastifyApp;
        await reset(prisma);
        fastifyApp.close();
    });

    return fastifyApp;
};

const fastifyApp = build();

export default fastifyApp;
