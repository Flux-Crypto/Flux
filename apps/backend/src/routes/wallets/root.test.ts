import app, { callAPI, testUser } from "@test/jestHelper";

import HttpStatus from "@lib/types/httpStatus";

const route = "/v1/wallets";
const {
    data: { id }
} = testUser;

describe(`GET ${route}`, () => {
    test("returns Bad Request for unauthorized request", async () => {
        const res = await callAPI(app, route, { auth: false });

        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
    });

    test("receives an OK request and returns OK response", async () => {
        const res = await callAPI(app, route);

        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.statusMessage).toBe("OK");
    });

    test("returns empty lists if user has no wallets", async () => {
        const res = await callAPI(app, route);
        const data = await res.json();

        expect(data).toBeInstanceOf(Object);
        expect(data).toHaveProperty("rdWallets");
        expect(data.rdWallets).toHaveLength(0);
        expect(data).toHaveProperty("rdwrWallets");
        expect(data.rdwrWallets).toHaveLength(0);
    });

    test("returns read-only wallets associated with user", async () => {
        const { prisma } = app;
        const sampleWallet = await prisma.wallet.create({
            data: {
                address: "0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5",
                rdUsers: {
                    connect: { id }
                }
            }
        });

        const res = await callAPI(app, route);
        const data = await res.json();

        expect(data).toBeInstanceOf(Object);
        expect(data).toHaveProperty("rdWallets");
        expect(data.rdWallets).toHaveLength(1);
        expect(data).toHaveProperty("rdwrWallets");
        expect(data.rdwrWallets).toHaveLength(0);

        const wallet = data.rdWallets[0];
        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet).not.toHaveProperty("seedPhrase");
        expect(wallet.address).toBe(sampleWallet.address);
    });

    test("returns read-write wallets associated with user", async () => {
        const { prisma } = app;
        const sampleWallet = await prisma.wallet.create({
            data: {
                address: "0x473780deaf4a2ac070bbba936b0cdefe7f267dfc",
                seedPhrase:
                    "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur",
                rdwrUsers: {
                    connect: { id }
                }
            }
        });

        const res = await callAPI(app, route);
        const data = await res.json();

        expect(data).toBeInstanceOf(Object);
        expect(data).toHaveProperty("rdWallets");
        expect(data.rdWallets).toHaveLength(0);
        expect(data).toHaveProperty("rdwrWallets");
        expect(data.rdwrWallets).toHaveLength(1);

        const wallet = data.rdwrWallets[0];
        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet.address).toBe(sampleWallet.address);
        expect(wallet).toHaveProperty("seedPhrase");
        expect(wallet.seedPhrase).toBe(sampleWallet.seedPhrase);
    });

    test("returns named wallets associated with user", async () => {
        const { prisma } = app;
        const sampleWallet1 = await prisma.wallet.create({
            data: {
                address: "0x983e3660c0be01991785f80f266a84b911ab59b0",
                rdUsers: {
                    connect: { id }
                },
                walletNames: {
                    create: [
                        {
                            userId: id,
                            name: "My Wallet"
                        }
                    ]
                }
            }
        });

        const sampleWallet2 = await prisma.wallet.create({
            data: {
                address: "0x6887246668a3b87f54deb3b94ba47a6f63f32985",
                seedPhrase:
                    "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur",
                rdwrUsers: {
                    connect: { id }
                }
            }
        });

        const res = await callAPI(app, route);
        const data = await res.json();

        expect(data).toBeInstanceOf(Object);
        expect(data).toHaveProperty("rdWallets");
        expect(data.rdWallets).toHaveLength(1);
        expect(data).toHaveProperty("rdwrWallets");
        expect(data.rdwrWallets).toHaveLength(1);

        const wallet1 = data.rdWallets[0];
        expect(wallet1).toBeInstanceOf(Object);
        expect(wallet1).toHaveProperty("address");
        expect(wallet1.address).toBe(sampleWallet1.address);
        expect(wallet1).not.toHaveProperty("seedPhrase");

        const wallet2 = data.rdwrWallets[0];
        expect(wallet2).toBeInstanceOf(Object);
        expect(wallet2).toHaveProperty("address");
        expect(wallet2.address).toBe(sampleWallet2.address);
        expect(wallet2).toHaveProperty("seedPhrase");
        expect(wallet2.seedPhrase).toBe(sampleWallet2.seedPhrase);
    });
});

// TODO: add checks for seedPhrase validation

describe(`POST ${route}`, () => {
    test("returns Bad Request for unauthorized request", async () => {
        const res = await callAPI(app, route, {
            auth: false,
            options: {
                method: "POST"
            }
        });

        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
    });

    test("returns Bad Request for missing body", async () => {
        const res = await callAPI(app, route, {
            options: { method: "POST" }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
    });

    test("returns Bad Request for invalid body", async () => {
        let res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    name: "John Doe"
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");

        res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: ""
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
        expect(res.body).toBe("Missing wallet address parameter");

        res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x1234567890"
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
        expect(res.body).toBe("Invalid wallet address");

        res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985",
                    seedPhrase:
                        "blame advance neglect foster time debris uncover hen ten indicate dinosaur"
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
        expect(res.body).toBe("Invalid seed phrase mnemonic");
    });

    test("receives an OK request and returns OK response", async () => {
        const res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.CREATED);
        expect(res.statusMessage).toBe("Created");
    });

    test("returns data for created read-only wallet", async () => {
        const res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
                })
            }
        });
        const wallet = await res.json();

        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet.address).toBe(
            "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
        );
        expect(wallet).not.toHaveProperty("seedPhrase");
        expect(wallet).not.toHaveProperty("rdUserIds");
        expect(wallet).not.toHaveProperty("rdwrUserIds");
        expect(wallet).not.toHaveProperty("rdUsers");
        expect(wallet).not.toHaveProperty("rdwrUsers");
        expect(wallet).not.toHaveProperty("walletNameIds");
        expect(wallet).not.toHaveProperty("walletNames");
    });

    test("returns data for created read-write wallet", async () => {
        const res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985",
                    seedPhrase:
                        "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
                })
            }
        });
        const wallet = await res.json();

        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet.address).toBe(
            "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
        );
        expect(wallet).toHaveProperty("seedPhrase");
        expect(wallet.seedPhrase).toBe(
            "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
        );
        expect(wallet).not.toHaveProperty("rdUserIds");
        expect(wallet).not.toHaveProperty("rdwrUserIds");
        expect(wallet).not.toHaveProperty("rdUsers");
        expect(wallet).not.toHaveProperty("rdwrUsers");
        expect(wallet).not.toHaveProperty("walletNameIds");
        expect(wallet).not.toHaveProperty("walletNames");
    });

    test("returns OK for linking already existing wallet", async () => {
        const { prisma } = app;
        await prisma.wallet.create({
            data: {
                address: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
            }
        });

        const res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.OK);
        expect(res.statusMessage).toBe("OK");
    });

    test("updates already existing wallet as read-only for user", async () => {
        const { prisma } = app;
        await prisma.wallet.create({
            data: {
                address: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
            }
        });

        let res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
                })
            }
        });
        let wallet = await res.json();

        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet.address).toBe(
            "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
        );
        expect(wallet).not.toHaveProperty("seedPhrase");
        expect(wallet).not.toHaveProperty("rdUserIds");
        expect(wallet).not.toHaveProperty("rdwrUserIds");
        expect(wallet).not.toHaveProperty("rdUsers");
        expect(wallet).not.toHaveProperty("rdwrUsers");
        expect(wallet).not.toHaveProperty("walletNameIds");
        expect(wallet).not.toHaveProperty("walletNames");

        await prisma.wallet.update({
            where: {
                address: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
            },
            data: {
                seedPhrase:
                    "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
            }
        });

        res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
                })
            }
        });
        wallet = await res.json();

        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet.address).toBe(
            "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
        );
        expect(wallet).not.toHaveProperty("seedPhrase");
        expect(wallet).not.toHaveProperty("rdUserIds");
        expect(wallet).not.toHaveProperty("rdwrUserIds");
        expect(wallet).not.toHaveProperty("rdUsers");
        expect(wallet).not.toHaveProperty("rdwrUsers");
        expect(wallet).not.toHaveProperty("walletNameIds");
        expect(wallet).not.toHaveProperty("walletNames");
    });

    test("updates already existing wallet as read-write for user", async () => {
        const { prisma } = app;
        await prisma.wallet.create({
            data: {
                address: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
            }
        });

        let res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985",
                    seedPhrase:
                        "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
                })
            }
        });
        let wallet = await res.json();

        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet.address).toBe(
            "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
        );
        expect(wallet).toHaveProperty("seedPhrase");
        expect(wallet.seedPhrase).toBe(
            "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
        );
        expect(wallet).not.toHaveProperty("rdUserIds");
        expect(wallet).not.toHaveProperty("rdwrUserIds");
        expect(wallet).not.toHaveProperty("rdUsers");
        expect(wallet).not.toHaveProperty("rdwrUsers");
        expect(wallet).not.toHaveProperty("walletNameIds");
        expect(wallet).not.toHaveProperty("walletNames");

        await prisma.wallet.update({
            where: {
                address: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
            },
            data: {
                seedPhrase:
                    "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
            }
        });

        res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985",
                    seedPhrase:
                        "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
                })
            }
        });
        wallet = await res.json();

        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet.address).toBe(
            "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
        );
        expect(wallet).toHaveProperty("seedPhrase");
        expect(wallet.seedPhrase).toBe(
            "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
        );
        expect(wallet).not.toHaveProperty("rdUserIds");
        expect(wallet).not.toHaveProperty("rdwrUserIds");
        expect(wallet).not.toHaveProperty("rdUsers");
        expect(wallet).not.toHaveProperty("rdwrUsers");
        expect(wallet).not.toHaveProperty("walletNameIds");
        expect(wallet).not.toHaveProperty("walletNames");
    });
});

describe.skip(`PUT ${route}`, () => {
    test.skip("returns data for created named wallet", async () => {
        let res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985",
                    name: "Watch Wallet"
                })
            }
        });
        let wallet = await res.json();

        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet.address).toBe(
            "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
        );
        expect(wallet).not.toHaveProperty("seedPhrase");
        expect(wallet).not.toHaveProperty("rdUserIds");
        expect(wallet).not.toHaveProperty("rdwrUserIds");
        expect(wallet).not.toHaveProperty("rdUsers");
        expect(wallet).not.toHaveProperty("rdwrUsers");
        expect(wallet).not.toHaveProperty("walletNameIds");
        expect(wallet).not.toHaveProperty("walletNames");
        expect(wallet).toHaveProperty("name");
        expect(wallet.name).toBe("Watch Wallet");

        res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: "0x6887246668a3b87f54deb3b94ba47a6f63f32985",
                    seedPhrase:
                        "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
                })
            }
        });
        wallet = await res.json();

        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet.address).toBe(
            "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
        );
        expect(wallet).toHaveProperty("seedPhrase");
        expect(wallet.seedPhrase).toBe(
            "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur"
        );
        expect(wallet).not.toHaveProperty("rdUserIds");
        expect(wallet).not.toHaveProperty("rdwrUserIds");
        expect(wallet).not.toHaveProperty("rdUsers");
        expect(wallet).not.toHaveProperty("rdwrUsers");
        expect(wallet).not.toHaveProperty("walletNameIds");
        expect(wallet).not.toHaveProperty("walletNames");
    });
});
