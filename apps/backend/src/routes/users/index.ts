import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import dayjs from "dayjs";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { logAndSendReply } from "@lib/logger";
import { FastifyDone } from "@lib/types/fastifyTypes";
import { UsersIndexSchema } from "@lib/types/jsonObjects";
import { UsersRequestBody } from "@lib/types/routeParams";
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
            const { email, firstName, lastName } =
                request.body as UsersRequestBody;

            if (!email)
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.BAD_REQUEST,
                    "Missing email parameter"
                );

            try {
                let userExists = true;
                let user = await prisma.user.findUnique({
                    where: {
                        email
                    }
                });

                if (!user) {
                    if (!firstName || !lastName)
                        logAndSendReply(
                            log.error,
                            reply,
                            HttpStatus.BAD_REQUEST,
                            "Missing first name and last name parameters"
                        );

                    userExists = false;
                    user = await prisma.user.create({
                        data: {
                            email,
                            firstName,
                            lastName,
                            verificationExpiry: dayjs().add(5, "day").toDate()
                        }
                    });
                }

                reply
                    .code(userExists ? HttpStatus.OK : HttpStatus.CREATED)
                    .send();
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
