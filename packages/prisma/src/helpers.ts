import { PrismaClient } from "@prisma/client";

export const reset = async (prisma: PrismaClient) => {
    const deleteWalletNames = prisma.walletName.deleteMany();
    const deleteWallets = prisma.wallet.deleteMany();
    const deleteUsers = prisma.user.deleteMany();

    await prisma.$transaction([deleteWalletNames, deleteWallets, deleteUsers]);
};

export const disconnect = async (prisma: PrismaClient) => {
    try {
        await prisma.$disconnect();
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
};
