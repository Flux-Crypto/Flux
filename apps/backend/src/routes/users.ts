import { UsersRequestBody } from "@backend/types/routeParams";
import { logError } from "@backend/utils/utils";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { FastifyInstance } from "fastify";

const users = (server: FastifyInstance, _: any, done: () => void) => {
    const { prisma } = server;

    server.post("/users", async (request, reply) => {
        const { email, name } = request.body as UsersRequestBody;

        if (!email) logError(reply, 400, "missing user id param");

        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    name
                }
            });

            return user;
        } catch (e) {
            if (e instanceof PrismaClientKnownRequestError)
                logError(reply, 500, e.message);

            logError(reply, 500, "creating user");
        }
        return "";
    });

    done();
};

export default users;
