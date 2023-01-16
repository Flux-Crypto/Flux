import { PrismaClient, TokenMetadata } from "@prisma/client";
import { Alchemy, Network, TokenMetadataResponse } from "alchemy-sdk";
import { FastifyBaseLogger } from "fastify";

const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_MAINNET
};

export const alchemy = new Alchemy(settings);

export const fetchMetadata = async (
    prisma: PrismaClient,
    log: FastifyBaseLogger,
    address: string
) => {
    // call database with address to get metadata
    try {
        const tokenMetadata = await prisma.tokenMetadata.findUnique({
            where: {
                address
            }
        });

        if (tokenMetadata) return tokenMetadata;
    } catch (e) {
        log.fatal(e);
        return null;
    }

    // else call API and update DB and tokens
    const result: TokenMetadataResponse = await alchemy.core.getTokenMetadata(
        address
    );
    if (!result) return null;
    try {
        const { decimals, logo, name, symbol } = result;
        await prisma.tokenMetadata.create({
            data: {
                address,
                decimals: decimals ?? 0,
                logo: logo ?? "",
                name: name ?? "",
                symbol: symbol ?? ""
            }
        });
    } catch (e) {
        log.fatal(e);
    }

    return result as TokenMetadata;
};
