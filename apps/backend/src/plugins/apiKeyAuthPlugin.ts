import {
    FastifyInstance,
    FastifyPluginAsync,
    FastifyReply,
    FastifyRequest
} from "fastify";
import fp from "fastify-plugin";

import { FastifyDone } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";

declare module "fastify" {
    interface FastifyInstance {
        verifyAPIKey: () => void;
    }
}

const apiKeyAuthPlugin: FastifyPluginAsync = fp(
    async (server: FastifyInstance) => {
        const { prisma } = server;

        server.decorate(
            "verifyAPIKey",
            async (
                request: FastifyRequest,
                reply: FastifyReply,
                done: FastifyDone
            ) => {
                const apiKey = request.headers["x-api-key"] as string;

                if (!apiKey) {
                    reply.code(HttpStatus.BAD_REQUEST).send("Missing API key.");
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
                } catch (err) {
                    reply
                        .code(HttpStatus.BAD_REQUEST)
                        .send("Invalid authentication.");
                }
            }
        );
    }
);

export default apiKeyAuthPlugin;
