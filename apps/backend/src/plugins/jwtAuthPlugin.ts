import jwtAuth from "@fastify/jwt";
import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

import HttpStatus from "@lib/types/httpStatus";

declare module "fastify" {
    interface FastifyInstance {
        verifyJWT: () => void;
    }
}

const jwtAuthPlugin: FastifyPluginAsync = fp(async (server) => {
    server.register(jwtAuth, {
        secret: process.env.NEXTAUTH_SECRET as string
    });

    server.decorate(
        "verifyJWT",
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify();
            } catch (err) {
                reply
                    .code(HttpStatus.BAD_REQUEST)
                    .send("Invalid authentication.");
            }
        }
    );
});

export default jwtAuthPlugin;
