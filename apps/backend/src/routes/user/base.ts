import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import _ from "lodash";

import { FastifyDone, JWT } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import { UserBaseSchema } from "@lib/types/jsonObjects";
import { UserRequestQuery, UsersPutRequestBody } from "@lib/types/routeOptions";

const baseRoute = (
    server: FastifyInstance,
    { get: getSchema, put: putSchema }: UserBaseSchema,
    done: FastifyDone
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            ...getSchema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = (request.user as JWT).user;

            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id
                    }
                });

                reply.send({
                    data: user
                });
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                    return;
                }

                const message = "Couldn't get user";
                log.error(message);
                reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send(message);
            }
        }
    );

    server.put(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            ...putSchema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { id } = (request.user as JWT).user;
            const body = request.body as UsersPutRequestBody;

            // TODO: make API keys objects (for change queues) OR send full array
            const properties: (keyof UsersPutRequestBody)[] = [
                "apiKey",
                "email",
                "exchangeAPIKeys",
                "firstName",
                "lastName",
                "processorAPIKeys"
            ];
            if (!body || _.every(properties, (prop) => !body[prop])) {
                const message = "Missing field(s) to update.";
                log.error(message);
                reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send(message);
                return;
            }

            try {
                await prisma.user.update({
                    where: { id },
                    data: {
                        ...body
                    }
                });

                reply.code(HttpStatus.NO_CONTENT).send();
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                    return;
                }

                const message = "Couldn't create user";
                log.error(message);
                reply.code(HttpStatus.INTERNAL_SERVER_ERROR).send(message);
            }
        }
    );

    done();
};

export default baseRoute;
