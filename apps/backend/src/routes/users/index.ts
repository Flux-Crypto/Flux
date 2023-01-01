import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { UsersRequestBody } from "../../types/routeParams";
import { logError } from "../../lib/utils";
import { UsersIndexSchema } from "types/jsonObjects";

const users = (
    server: FastifyInstance,
    { get: getSchema, post: postSchema }: UsersIndexSchema,
    done: () => void
) => {
    const { prisma } = server;

    server.get("/", getSchema, async (_request, reply) => {
        try {
            const user = await prisma.user.findMany();

            return user;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "getting users");
        }
    });

    server.post("/", postSchema, async (request, reply) => {
        const { email, name } = request.body as UsersRequestBody;

        if (!email) logError(reply, 404, "missing user id param");

        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    name
                }
            });

            return user;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "creating user");
        }
    });

    done();
};

export default users;
