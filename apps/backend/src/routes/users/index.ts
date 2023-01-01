import { UsersIndexSchema } from "@lib/types/jsonObjects";
import { UsersRequestBody } from "@lib/types/routeParams";
import { logError } from "@lib/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance } from "fastify";

const index = (
    server: FastifyInstance,
    { get: getSchema, post: postSchema }: UsersIndexSchema,
    done: () => void
) => {
    const { prisma } = server;

    server.get("/", getSchema, async (_request, reply) => {
        try {
            const users = await prisma.user.findMany();

            reply.send(users);
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "getting users");
        }
    });

    server.post("/", postSchema, async (request, reply) => {
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
    });

    done();
};

export default index;
