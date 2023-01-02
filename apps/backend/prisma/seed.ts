import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const reset = async () => {
    const deleteTransactions = prisma.transaction.deleteMany();
    const deleteWallets = prisma.wallet.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteTransactions, deleteWallets, deleteUsers]);
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

    const alice = await prisma.user.upsert({
        where: { email: "alice@prisma.io" },
        update: {},
        create: {
            email: "alice@prisma.io",
            name: "Alice"
        }
    });
    const bob = await prisma.user.upsert({
        where: { email: "bob@prisma.io" },
        update: {},
        create: {
            email: "bob@prisma.io",
            name: "Bob"
        }
    });

    await disconnect();
};

main();
