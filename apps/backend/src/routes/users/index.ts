import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { logAndSendReply } from "@lib/logger";
import { UsersIndexSchema } from "@lib/types/jsonObjects";
import { UsersRequestBody } from "@lib/types/routeParams";
import { FastifyDone } from "@src/lib/types/fastifyTypes";
import HttpStatus from "@src/lib/types/httpStatus";

const indexRoute = (
    server: FastifyInstance,
    { get: getSchema, post: postSchema }: UsersIndexSchema,
    done: FastifyDone
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        getSchema,
        async (_request: FastifyRequest, reply: FastifyReply) => {
            try {
                const users = await prisma.user.findMany();

                reply.send(users);
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
                    "Couldn't get users."
                );
            }
        }
    );

    server.post(
        "/",
        postSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { userId, sessionId } = request.body as UsersRequestBody;

            const clientToken = request.cookies.__session;

            if (!sessionId || !clientToken)
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required"
                );

            // TODO: check expire time

            if (!userId)
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing user id parameter"
                );

            try {
                const user = await prisma.user.create({
                    data: {
                        id: userId
                    }
                });

                reply.code(201).send(user);
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
                    "Couldn't create user."
                );
            }
        }
    );

    done();
};

export default indexRoute;
