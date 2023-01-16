import { PrismaClient } from "@prisma/client";
import { FastifyBaseLogger } from "fastify";
import _ from "lodash";

import { fetchMetadata } from "./alchemy";

export const getTokenBalance = async (walletAddress: string) => {
    const url = `https://deep-index.moralis.io/api/v2/${walletAddress}/erc20?chain=eth`;

    const response = await fetch(url, {
        headers: {
            "x-api-key": process.env.MORALIS_API_KEY as string,
            accept: "application/json"
        }
    });
    const tokensArray = await response.json();
    return tokensArray;
};

export const processTokens = async (
    prisma: PrismaClient,
    log: FastifyBaseLogger,
    walletAddress: string
) => {
    const assets = await getTokenBalance(walletAddress);

    const tokenAssets = [];
    for (const token of assets) {
        const newToken = _.omit(token, "thumbnail");
        const { logo, name, token_address: address, symbol } = newToken;
        if (logo) {
            await prisma.tokenMetadata.upsert({
                where: {
                    address
                },
                create: {
                    address,
                    name,
                    symbol,
                    logo
                },
                update: {}
            });
            tokenAssets.push(newToken);
        } else {
            const metadata = await fetchMetadata(prisma, log, address);
            tokenAssets.push({
                ...newToken,
                logo: metadata?.logo
            });
        }
    }

    return tokenAssets;
};
