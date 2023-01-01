import { UserIndexSchema } from "../../lib/types/jsonObjects";
import { UserRequestParams } from "../../lib/types/routeParams";
import { logError } from "../../lib/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance } from "fastify";

const user = (
    server: FastifyInstance,
    { get: getSchema }: UserIndexSchema,
    done: () => void
) => {
    const { prisma } = server;

    server.get("/", getSchema, async (request, reply) => {
        const { userId } = request.params as UserRequestParams;
        if (!userId) {
            logError(reply, 404, "missing user id param");
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

            logError(reply, 500, "getting user");
        }
    });

    done();
};

export default user;
