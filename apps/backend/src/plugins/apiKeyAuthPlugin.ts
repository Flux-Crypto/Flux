import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyReply,
    FastifyRequest
} from "fastify";
import fp from "fastify-plugin";

import { FastifyDone } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import { APIAuthenticationHeaders } from "@src/lib/types/routeOptions";

declare module "fastify" {
    interface FastifyInstance {
        verifyAPIKey: () => void;
    }
}

const apiKeyAuthPlugin: FastifyPluginAsync = fp(
    async (server: FastifyInstance) => {
        const { log, prisma } = server;

        server.decorate(
            "verifyAPIKey",
            async (
                request: FastifyRequest,
                reply: FastifyReply,
                done: FastifyDone
            ) => {
                const { "x-api-key": apiKey } =
                    request.headers as APIAuthenticationHeaders;

                if (!apiKey) {
                    const message = "Missing API key.";
                    log.error(message);
                    reply.code(HttpStatus.BAD_REQUEST).send(message);
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            apiKey
                        }
                    });
                    if (!user) {
                        reply
                            .code(HttpStatus.UNAUTHORIZED)
                            .send("User not found.");
                    }

                    done();
                } catch (e) {
                    reply.code(HttpStatus.INTERNAL_SERVER_ERROR);

                    if (e instanceof PrismaClientKnownRequestError) {
                        log.fatal(e);
                        reply.send("Server error");
                    }

                    const message = "Couldn't authenticate user";
                    log.error(message);
                    reply.send(message);
                }
            }
        );
    }
);

export default apiKeyAuthPlugin;
