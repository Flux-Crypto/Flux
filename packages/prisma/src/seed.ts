import { PrismaClient } from "@prisma/client";

import { disconnect, reset } from "./helpers";

const user1 = {
    data: {
        firstName: "alice",
        lastName: "bob",
        email: "alice@prisma.io",
        emailVerified: new Date("01/13/2023 03:56:54"),
        apiKey: "uvwxyz67890",
        processorAPIKeys: ["abcdef12345"],
        exchangeAPIKeys: ["uvwxyz67890"],
        rdWallets: {
            create: [
                {
                    address: "0xd0451f62be92c2e45dbafbf0a9aa5fd42f1798ea"
                }
            ]
        },
        rdwrWallets: {
            create: [
                {
                    address: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
                    seedPhrase:
                        "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
                }
            ]
        },
        createdAt: new Date("01/13/2023 03:56:54"),
        updatedAt: new Date("01/13/2023 03:56:54")
    }
};

const user2 = {
    data: {
        firstName: "foo",
        lastName: "bar",
        email: "bob@prisma.io",
        emailVerified: new Date("01/13/2023 03:56:54"),
        apiKey: "abcdef12345",
        processorAPIKeys: ["abcdef12345"],
        exchangeAPIKeys: ["uvwxyz67890"],
        rdWallets: {
            connect: [
                {
                    address: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"
                },
                {
                    address: "0xd0451f62be92c2e45dbafbf0a9aa5fd42f1798ea"
                }
            ]
        },
        walletNames: {
            create: [
                {
                    walletAddress: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
                    name: "My Wallet"
                }
            ]
        },
        importTransactions: {
            date: new Date("06/14/2017 20:57:35"),
            receivedQuantity: 0.5,
            receivedCurrency: "BTC",
            sentQuantity: 4005.8,
            sentCurrency: "USD",
            feeAmount: 0.00001,
            feeCurrency: "BTC",
            tags: ["PAYMENT"]
        },
        createdAt: new Date("01/13/2023 03:56:54"),
        updatedAt: new Date("01/13/2023 03:56:54")
    }
};

const main = async () => {
    const prisma = new PrismaClient();

    await reset(prisma);

    const createUser1 = prisma.user.create(user1);
    const createUser2 = prisma.user.create(user2);

    await prisma.$transaction([createUser1, createUser2]);

    await disconnect(prisma);
};

main();
