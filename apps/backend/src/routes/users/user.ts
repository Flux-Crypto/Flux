import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { logAndSendReply } from "@lib/logger";
import HttpStatus from "@lib/types/httpStatus";
import { UserIndexSchema } from "@lib/types/jsonObjects";
import { UserRequestQuery } from "@lib/types/routeParams";

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
            const { id, email } = request.query as UserRequestQuery;
            if (!id && !email)
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing id or email parameter"
                );

            try {
                const user = await prisma.user.findUnique({
                    where: id ? { id } : { email }
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
