import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { logAndSendReply } from "@lib/logger";
import HttpStatus from "@lib/types/httpStatus";
import { UserIndexSchema } from "@lib/types/jsonObjects";
import { UserRequestParams } from "@lib/types/routeParams";

const userRoute = (
    server: FastifyInstance,
    { get: getSchema }: UserIndexSchema,
    done: () => void
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        getSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { userId } = request.params as UserRequestParams;
            if (!userId)
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing user id parameter"
                );

            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: userId
                    }
                });

                reply.send(user);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                }
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Couldn't get user"
                );
            }
        }
    );

    done();
};

export default userRoute;
