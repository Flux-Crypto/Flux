import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { UsersRequestBody } from "src/types/routeParams";
import { logError } from "src/utils/utils";

const users = (server: FastifyInstance, _: any, done: () => void) => {
    const { prisma } = server;

    server.post("/users", async (request, reply) => {
        const { email, name } = request.body as UsersRequestBody;

        if (!email) logError(reply, 400, "missing user id param");

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
