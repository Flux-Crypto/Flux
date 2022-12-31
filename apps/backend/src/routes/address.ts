import { FastifyInstance } from "fastify";
import { alchemy } from "../utils/blockchain";

// import { prisma } from "../index";
import { AddressRequestParams } from "src/types/routeParams";

const address = (server: FastifyInstance, _: any, done: () => void) => {
    server.get("/:address/transactions", async (request, reply) => {
        const { address } = request.params as AddressRequestParams;

        if (!address) {
            console.error(
                `[${new Date().toISOString()}] error: missing address param`
            );
            reply.code(400).send("error: missing user id param");
        }

        const data = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            fromAddress: "0x974caa59e49682cda0ad2bbe82983419a2ecc400",
            category: ["internal", 'erc20']
        })
        
        reply.status(200).send(`latest block is ${}`);
    });

    done();
};

export default address;
