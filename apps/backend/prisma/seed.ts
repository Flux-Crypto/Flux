import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const reset = async () => {
    const deleteWallets = prisma.wallet.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteWallets, deleteUsers]);
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

    await prisma.user.create({
        data: {
            email: "alice@prisma.io",
            name: "Alice",
            processorAPIKeys: ["abcdef12345"],
            exchangeAPIKeys: ["uvwxyz67890"],
            wallets: {
                create: [
                    {
                        address: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
                        readOnly: false,
                        seedPhrase:
                            "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
                    },
                    {
                        address: "0xd0451f62be92c2e45dbafbf0a9aa5fd42f1798ea"
                    }
                ]
            }
        }
    });

    await prisma.user.create({
        data: {
            email: "bob@prisma.io",
            name: "Bob",
            wallets: {
                connect: [
                    {
                        address: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5"
                    },
                    {
                        address: "0xd0451f62be92c2e45dbafbf0a9aa5fd42f1798ea"
                    }
                ]
            },
            transactions: {
                date: new Date("06/14/2017 20:57:35"),
                receivedQuantity: 0.5,
                receivedCurrency: "BTC",
                sentQuantity: 4005.8,
                sentCurrency: "USD",
                feeAmount: 0.00001,
                feeCurrency: "BTC",
                tag: "PAYMENT"
            }
        }
    });

    await disconnect();
};

main();
