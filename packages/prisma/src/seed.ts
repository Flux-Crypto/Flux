import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const reset = async () => {
    const deleteWalletNames = prisma.walletName.deleteMany();
    const deleteWallets = prisma.wallet.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteWalletNames, deleteWallets, deleteUsers]);
};

const disconnect = async () => {
    try {
        await prisma.$disconnect();
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
};

const main = async () => {
    await reset();

    const createUser1 = prisma.user.create({
        data: {
            firstName: "alice",
            lastName: "bob",
            email: "alice@prisma.io",
            emailVerified: new Date("01/13/2023 03:56:54"),
            apiKey: "abcdef12345",
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
    });
    const createUser2 = prisma.user.create({
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
                        walletAddress:
                            "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
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
    });

    await prisma.$transaction([createUser1, createUser2]);

    await disconnect();
};

main();
