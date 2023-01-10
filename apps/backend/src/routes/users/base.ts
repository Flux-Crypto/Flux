import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";
import { UsersBaseSchema } from "@lib/types/jsonObjects";
import { UsersPostRequestBody } from "@lib/types/routeParams";
import HttpStatus from "@src/lib/types/httpStatus";

const baseRoute = (
    server: FastifyInstance,
    { get: getSchema, post: postSchema }: UsersBaseSchema,
    done: FastifyDone
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey], {
                relation: "or"
            }),
            ...getSchema
        },
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

                const message = "Couldn't get users";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
            }
        }
    );

    server.post(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey], {
                relation: "or"
            }),
            ...postSchema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { email } = request.body as UsersPostRequestBody;

            if (!email) {
                const message = "Missing email parameter";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
            }

            try {
                // ? Redo? not sure why tho but that's a **__t o n y__** problem
                await prisma.user.upsert({
                    where: { email: email || "" },
                    update: {},
                    create: {
                        email,
                        firstName: "",
                        lastName: ""
                    }
                });

                reply.send();
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    log.fatal(e);
                    reply
                        .code(HttpStatus.INTERNAL_SERVER_ERROR)
                        .send("Server error");
                }

                const message = "Couldn't create user";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
            }
        }
    );

    done();
};

export default baseRoute;
