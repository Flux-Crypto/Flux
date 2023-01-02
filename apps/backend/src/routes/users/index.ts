import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { FastifyDone } from "@src/lib/types/fastifyTypes";

import { UsersIndexSchema } from "@lib/types/jsonObjects";
import { UsersRequestBody } from "@lib/types/routeParams";
import { logError } from "@lib/utils";

const indexRoute = (
    server: FastifyInstance,
    { get: getSchema, post: postSchema }: UsersIndexSchema,
    done: FastifyDone
) => {
    const { prisma } = server;

    server.get(
        "/",
        getSchema,
        async (_request: FastifyRequest, reply: FastifyReply) => {
            try {
                const users = await prisma.user.findMany();

                reply.send(users);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError)
                    logError(reply, 500, e.message);

                logError(reply, 500, "getting users");
            }
        }
    );

    server.post(
        "/",
        postSchema,
        async (request: FastifyRequest, reply: FastifyReply) => {
            const { email, name } = request.body as UsersRequestBody;

            if (!email) logError(reply, 404, "missing email param");

            try {
                const user = await prisma.user.create({
                    data: {
                        email,
                        name
                    }
                });

                reply.code(201).send(user);
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError)
                    logError(reply, 500, e.message);

                logError(reply, 500, "creating user");
            }
        }
    );

    done();
};

export default indexRoute;
