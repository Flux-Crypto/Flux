import {
    FastifyInstance,
    FastifyReply,
    FastifyRequest,
    FastifyServerOptions
} from "fastify";
import _ from "lodash";

import { processTokens } from "@lib/blockchain/quicknode";
import { FastifyDone } from "@lib/types/fastifyTypes";
import HttpStatus from "@lib/types/httpStatus";
import { ExplorerWalletRequestParams } from "@lib/types/routeOptions";

const info = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    const { prisma, log } = server;

    server.get(
        "/",
        {
            onRequest: server.auth([server.verifyJWT, server.verifyAPIKey])
            // TODO: add schema
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            // add query string option for most recent or oldest
            const { walletAddress } =
                request.params as ExplorerWalletRequestParams;
            if (!walletAddress) {
                const message = "Missing wallet address parameter";
                log.error(message);
                reply
                    .code(HttpStatus.BAD_REQUEST)
                    .send("Missing wallet address parameter");
                return;
            }

            // get erc 20 tokens information
            const tokens = await processTokens(prisma, log, walletAddress);

            reply.send({
                tokens
            });
        }
    );

    done();
};

export default info;
