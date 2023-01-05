import {
    ClerkExpressWithAuth,
    WithAuthProp,
    sessions
} from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";

import { logAndSendReply } from "./logger";
import HttpStatus from "./types/httpStatus";
import { UserRequestParams } from "./types/routeParams";

const clerkPreHandler = (prisma: PrismaClient) =>
    ClerkExpressWithAuth(
        async (request: WithAuthProp<FastifyRequest>, reply: FastifyReply) => {
            const { log } = request;

            const { "x-api-key": apiKey } = request.headers;
            const { userId, sessionId } = request.auth;
            const { userId: userIdParam } = request.params as UserRequestParams;

            if (!apiKey && !sessionId)
                logAndSendReply(
                    log.error,
                    reply,
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required"
                );

            if (apiKey && !sessionId) {
                const user = await prisma.user.findUnique({
                    where: {
                        apiKey: apiKey as string
                    },
                    select: {
                        id: true
                    }
                });

                if (userIdParam !== user?.id)
                    logAndSendReply(
                        log.error,
                        reply,
                        HttpStatus.UNAUTHORIZED,
                        "Authentication required"
                    );
            } else {
                // named "__session" for Firebase compatibility
                const clientToken = request.cookies.__session;

                if (!clientToken)
                    logAndSendReply(
                        log.error,
                        reply,
                        HttpStatus.UNAUTHORIZED,
                        "Authentication required"
                    );

                const session = await sessions.verifySession(
                    sessionId as string,
                    clientToken as string
                );

                // TODO: check expire time

                if (session?.userId !== userId)
                    logAndSendReply(
                        log.error,
                        reply,
                        HttpStatus.UNAUTHORIZED,
                        "Authorization required"
                    );
            }
        }
    );

export default clerkPreHandler;
