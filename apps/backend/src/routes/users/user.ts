import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { log } from "@lib/logger";
import { UserIndexSchema } from "@lib/types/jsonObjects";
import { UserRequestParams } from "@lib/types/routeParams";

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
            if (!userId) 
                log(request.log.error, reply, 400, "Missing user id parameter");

            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: userId
                    }
                });

                reply.send(user);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    request.log.fatal(e);
                    reply.code(500).send("Server error");
                }
                log(request.log.error, reply, 500, "Couldn't get user");
            }
        }
    );

    done();
};

export default userRoute;
