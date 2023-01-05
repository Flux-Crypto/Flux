import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
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
            console.info(request.body);
            // const { email, firstName, lastName } = request.body as UsersRequestBody;

            reply.code(HttpStatus.OK).send({ status: "ok" });

            // if (!email || !firstName || !lastName)
            //     logAndSendReply(
            //         log.error,
            //         reply,
            //         HttpStatus.BAD_REQUEST,
            //         "Incomplete registration body"
            //     );

            // try {
            //     let userExists = true;
            //     let user = await prisma.user.findUnique({
            //         where: {
            //             email
            //         }
            //     });

            //     if (!user) {
            //         userExists = false;
            //         user = await prisma.user.create({
            //             data: {
            //                 email,
            //                 firstName,
            //                 lastName
            //             }
            //         });
            //     }

            //     reply
            //         .code(userExists ? HttpStatus.OK : HttpStatus.CREATED)
            //         .send();
            // } catch (e) {
            //     if (e instanceof PrismaClientKnownRequestError) {
            //         log.fatal(e);
            //         reply
            //             .code(HttpStatus.INTERNAL_SERVER_ERROR)
            //             .send("Server error");
            //     }

            //     logAndSendReply(
            //         log.error,
            //         reply,
            //         HttpStatus.INTERNAL_SERVER_ERROR,
            //         "Couldn't create user."
            //     );
            // }
        }
    );

    done();
};

export default indexRoute;
