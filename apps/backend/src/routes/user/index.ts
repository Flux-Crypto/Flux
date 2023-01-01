import { FastifyInstance } from "fastify";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { UserRequestParams } from "../../types/routeParams";
import UserSchema from "../../../docs/schemas/user.json";
import { logError } from "../../lib/utils";

const user = (server: FastifyInstance, _opts: any, done: () => void) => {
    const { prisma } = server;

    const { GetUserSchema } = UserSchema;

    server.get("/", GetUserSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            logError(reply, 400, "missing user id param");
            return;
        }

        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            });

            return user;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "fetching user");
        }
    });

    done();
};

export default user;
