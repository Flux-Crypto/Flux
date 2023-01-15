import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions
} from "fastify";
import fp from "fastify-plugin";

import { FastifyDone } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import { APIAuthenticationHeaders } from "@lib/types/routeOptions";

declare module "fastify" {
    interface FastifyInstance {
        verifyAPIKey: () => void;
    }
}

const apiKeyAuthPlugin = fp(
    async (
        fastify: FastifyInstance,
        _opts: FastifyServerOptions,
        done: FastifyDone
    ) => {
        const { log, prisma } = fastify;

        fastify.decorate(
            "verifyAPIKey",
            async (
                request: FastifyRequest,
                reply: FastifyReply,
                decoratorDone: FastifyDone
            ) => {
                const { "x-api-key": apiKey } =
                    request.headers as APIAuthenticationHeaders;

                if (!apiKey) {
                    const message = "Missing API key.";
                    log.error(message);
                    reply.code(HttpStatus.BAD_REQUEST).send(message);
                    done();
                }

                try {
                    const user = await prisma.user.findUnique({
                        where: {
                            apiKey
                        }
                    });
                    if (!user) {
                        const message = "User not found.";
                        log.error(message);
                        reply.code(HttpStatus.UNAUTHORIZED).send(message);
                    }

                    done();
                } catch (e) {
                    reply.code(HttpStatus.INTERNAL_SERVER_ERROR);

                    if (e instanceof PrismaClientKnownRequestError) {
                        log.fatal(e);
                        reply.send("Server error");
                        done();
                    }

                    const message = "Couldn't authenticate user";
                    log.error(message);
                    reply.send(message);
                }

                decoratorDone();
            }
        );

        done();
    }
);

export default apiKeyAuthPlugin;
