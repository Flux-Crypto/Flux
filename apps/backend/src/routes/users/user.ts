import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { UserIndexSchema } from "@lib/types/jsonObjects";
import { UserRequestParams } from "@lib/types/routeParams";
import { logError } from "@lib/utils";

const userRoute = (
    server: FastifyInstance,
    { get: getSchema }: UserIndexSchema,
    done: () => void
) => {
    const { prisma } = server;

    server.get(
        "/",
        getSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { userId } = request.params as UserRequestParams;
            if (!userId) logError(reply, 400, "missing user id param");

            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: userId
                    }
                });

                reply.send(user);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError)
                    logError(reply, 500, e.message);

                logError(reply, 500, "getting user");
            }
        }
    );

    done();
};

export default userRoute;
