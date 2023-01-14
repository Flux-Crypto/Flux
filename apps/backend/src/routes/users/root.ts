import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { FastifyDone } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import { UsersBaseSchema } from "@lib/types/jsonObjects";
import { UsersPostRequestBody } from "@lib/types/routeOptions";

const baseRoute = (
    server: FastifyInstance,
    { get: getSchema, post: postSchema }: UsersBaseSchema,
    done: FastifyDone
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey]),
            schema: getSchema
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
                    return;
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
            schema: postSchema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { email } = request.body as UsersPostRequestBody;

            if (!email) {
                const message = "Missing email parameter";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
                return;
            }

            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!email.match(emailRegex)) {
                const message = "Not a valid email";
                log.error(message);
                reply.code(HttpStatus.BAD_REQUEST).send(message);
                return;
            }

            try {
                const user = await prisma.user.upsert({
                    where: { email },
                    update: {},
                    create: {
                        email,
                        firstName: "",
                        lastName: ""
                    }
                });

                reply.code(HttpStatus.CREATED).send(user);
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
                reply.code(HttpStatus.BAD_REQUEST).send(message);
            }
        }
    );

    done();
};

export default baseRoute;
