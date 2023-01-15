import { reset } from "@flux/prisma/src/helpers";
import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
// eslint-disable-next-line import/no-extraneous-dependencies
import jwt from "jsonwebtoken";
import { env } from "process";

import build from "../app";

export type HTTPMethods =
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
        email: "test@flux.crypto"
    }
};

export const testDummy = {
    data: {
        id: "63c381109d3cb4056b0d6a47",
        email: "dummy@flux.crypto"
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

const createUsers = async (prisma: PrismaClient) => {
    /* simulate an active session with a test user and fake JWT */
    const createTestUser = prisma.user.create(testUser);
    const createTestDummy = prisma.user.create(testDummy);
    await prisma.$transaction([createTestUser, createTestDummy]);
};

const app = () => {
    const fastifyApp = build();
    console.log(process.env.DB_URL !== undefined);
    console.log(process.env.DB_URL);

    beforeAll(async () => {
        await fastifyApp.ready();
        await fastifyApp.listen();

        const { prisma } = fastifyApp;
        await reset(prisma);
        await createUsers(prisma);
    });

    beforeEach(async () => {
        const { prisma } = fastifyApp;
        await reset(prisma);
        await createUsers(prisma);
    });

    afterAll(async () => {
        const { prisma } = fastifyApp;
        await reset(prisma);
        await fastifyApp.close();
    });

    return fastifyApp;
};

const fastifyApp = app();

export default fastifyApp;
