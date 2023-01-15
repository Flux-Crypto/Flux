import jwtAuth from "@fastify/jwt";
import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions
} from "fastify";
import fp from "fastify-plugin";

import HttpStatus from "@lib/types/httpStatus";

declare module "fastify" {
    interface FastifyInstance {
        verifyJWT: () => void;
    }
}

const jwtAuthPlugin: FastifyPluginAsync = fp(
    async (fastify: FastifyInstance, _opts: FastifyServerOptions) => {
        fastify.register(jwtAuth, {
            secret: process.env.NEXTAUTH_SECRET as string
        });

        fastify.decorate(
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
    }
);

export default jwtAuthPlugin;
