import jwtAuth from "@fastify/jwt";
import {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions
} from "fastify";
import fp from "fastify-plugin";

import { FastifyDone } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";

declare module "fastify" {
    interface FastifyInstance {
        verifyJWT: () => void;
    }
}

const jwtAuthPlugin = fp(
    async (
        fastify: FastifyInstance,
        _opts: FastifyServerOptions,
        done: FastifyDone
    ) => {
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

        done();
    }
);

export default jwtAuthPlugin;
