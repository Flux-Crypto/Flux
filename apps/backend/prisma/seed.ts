import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const reset = async () => {
    await prisma.user.deleteMany();
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
