import { Wallet } from "@prisma/client";
import app, {
    HTTPMethods,
    callAPI,
    testDummy,
    testUser
} from "@test/jestHelper";

import HttpStatus from "@lib/types/httpStatus";
import { stubWallet } from "@src/test/modelStubs";

enum WalletAccess {
    ReadOnly = "read-only",
    ReadWrite = "read-write"
}

const route = "/v1/wallets";
const {
    data: { id }
} = testUser;

const { address, seedPhrase } = stubWallet;

const checkHiddenFields = (wallet: Wallet) => {
    expect(wallet).not.toHaveProperty("rdUserIds");
    expect(wallet).not.toHaveProperty("rdwrUserIds");
    expect(wallet).not.toHaveProperty("rdUsers");
    expect(wallet).not.toHaveProperty("rdwrUsers");
    expect(wallet).not.toHaveProperty("walletNameIds");
    expect(wallet).not.toHaveProperty("walletNames");
};

const checkSeedPhrase = (
    wallet: Wallet,
    access: "read-only" | "read-write"
) => {
    if (access === "read-only") expect(wallet).not.toHaveProperty("seedPhrase");
    else {
        expect(wallet).toHaveProperty("seedPhrase");
        expect(wallet.seedPhrase).toBe(seedPhrase);
    }
};

describe.each([
    { route, method: "GET" as HTTPMethods },
    { route, method: "POST" as HTTPMethods },
    {
        route: `${route}/${address}`,
        method: "PUT" as HTTPMethods
    },
    {
        route: `${route}/${address}`,
        method: "DELETE" as HTTPMethods
    }
])("route authorization for $method $route", ({ route: testRoute, method }) => {
    test("returns Bad Request for unauthorized request", async () => {
        const res = await callAPI(app, testRoute, {
            auth: false,
            options: {
                method
            }
        });

        expect(res.statusCode).toEqual(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
    });
});

describe(`GET ${route}`, () => {
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

    test.each([
        {
            access: WalletAccess.ReadOnly,
            testField: "rdWallets",
            otherField: "rdwrWallets",
            sampleData: {
                rdUsers: {
                    connect: { id }
                }
            }
        },
        {
            access: WalletAccess.ReadWrite,
            testField: "rdwrWallets",
            otherField: "rdWallets",
            sampleData: {
                seedPhrase,

                rdwrUsers: {
                    connect: { id }
                }
            }
        }
    ])(
        "returns $access wallets associated with user",
        async ({ access, testField, otherField, sampleData }) => {
            const { prisma } = app;
            await prisma.wallet.create({
                data: {
                    address,
                    ...sampleData
                }
            });

            const res = await callAPI(app, route);
            const data = await res.json();

            expect(data).toBeInstanceOf(Object);
            expect(data).toHaveProperty("rdWallets");
            expect(data).toHaveProperty("rdwrWallets");
            expect(data[testField]).toHaveLength(1);
            expect(data[otherField]).toHaveLength(0);

            const wallet = data[testField][0];
            expect(wallet).toBeInstanceOf(Object);
            expect(wallet).toHaveProperty("address");
            expect(wallet.address).toBe(address);
            checkSeedPhrase(wallet, access);
        }
    );

    test.each([
        {
            access: WalletAccess.ReadOnly,
            testField: "rdWallets",
            otherField: "rdwrWallets",
            sampleData: {
                rdUsers: {
                    connect: { id }
                }
            }
        },
        {
            access: WalletAccess.ReadWrite,
            testField: "rdwrWallets",
            otherField: "rdWallets",
            sampleData: {
                seedPhrase,

                rdwrUsers: {
                    connect: { id }
                }
            }
        }
    ])(
        "returns named $access wallets associated with user",
        async ({ access, testField, otherField, sampleData }) => {
            const { prisma } = app;
            await prisma.wallet.create({
                data: {
                    address,
                    ...sampleData,
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

            const res = await callAPI(app, route);
            const data = await res.json();

            expect(data).toBeInstanceOf(Object);
            expect(data).toHaveProperty("rdWallets");
            expect(data).toHaveProperty("rdwrWallets");
            expect(data[testField]).toHaveLength(1);
            expect(data[otherField]).toHaveLength(0);

            const wallet = data[testField][0];
            expect(wallet).toBeInstanceOf(Object);
            expect(wallet).toHaveProperty("address");
            expect(wallet.address).toBe(address);
            checkSeedPhrase(wallet, access);
            expect(wallet).toHaveProperty("name");
            expect(wallet.name).toBe("My Wallet");
        }
    );
});

// TODO: add checks for seedPhrase validation

describe(`POST ${route}`, () => {
    test("returns Bad Request for missing body", async () => {
        const res = await callAPI(app, route, {
            options: { method: "POST" }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
    });

    test.each([
        {
            type: "invalid field",
            bodyData: {
                name: "John Doe"
            },
            responseBody: "null"
        },
        {
            type: "missing wallet address",
            bodyData: {
                walletAddress: ""
            },
            responseBody: "Missing wallet address parameter"
        },
        {
            type: "invalid wallet address",
            bodyData: {
                walletAddress: "0x1234567890"
            },
            responseBody: "Invalid wallet address"
        },
        {
            type: "invalid seed phrase",
            bodyData: {
                walletAddress: address,
                seedPhrase:
                    "blame advance neglect foster time debris uncover hen ten indicate dinosaur"
            },
            responseBody: "Invalid seed phrase mnemonic"
        }
    ])(
        "returns Bad Request for invalid body: $type",
        async ({ bodyData, responseBody }) => {
            const res = await callAPI(app, route, {
                options: {
                    method: "POST",
                    body: JSON.stringify(bodyData)
                }
            });

            expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(res.statusMessage).toBe("Bad Request");
            expect(res.body).toBe(responseBody);
        }
    );

    test("receives an OK request and returns OK response", async () => {
        const res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: address
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.CREATED);
        expect(res.statusMessage).toBe("Created");
    });

    test.each([
        {
            access: WalletAccess.ReadOnly,
            bodyData: {
                walletAddress: address
            }
        },
        {
            access: WalletAccess.ReadWrite,
            bodyData: {
                walletAddress: address,
                seedPhrase
            }
        }
    ])(
        "returns data for created $access wallet",
        async ({ access, bodyData }) => {
            const res = await callAPI(app, route, {
                options: {
                    method: "POST",
                    body: JSON.stringify(bodyData)
                }
            });
            const wallet = await res.json();

            expect(wallet).toBeInstanceOf(Object);
            expect(wallet).toHaveProperty("address");
            expect(wallet.address).toBe(address);
            checkSeedPhrase(wallet, access);
            checkHiddenFields(wallet);
        }
    );

    test.each([
        {
            access: WalletAccess.ReadOnly,
            bodyData: {
                walletAddress: address
            }
        },
        {
            access: WalletAccess.ReadWrite,
            bodyData: {
                walletAddress: address,
                seedPhrase
            }
        }
    ])(
        "returns OK for linking already existing wallet as $access",
        async ({ bodyData }) => {
            const { prisma } = app;
            await prisma.wallet.create({
                data: {
                    address
                }
            });

            let res = await callAPI(app, route, {
                options: {
                    method: "POST",
                    body: JSON.stringify(bodyData)
                }
            });

            expect(res.statusCode).toBe(HttpStatus.OK);
            expect(res.statusMessage).toBe("OK");

            await prisma.wallet.update({
                where: {
                    address
                },
                data: {
                    seedPhrase
                }
            });

            res = await callAPI(app, route, {
                options: {
                    method: "POST",
                    body: JSON.stringify(bodyData)
                }
            });

            expect(res.statusCode).toBe(HttpStatus.OK);
            expect(res.statusMessage).toBe("OK");
        }
    );

    test.each([
        {
            access: WalletAccess.ReadOnly,
            bodyData: {
                walletAddress: address
            }
        },
        {
            access: WalletAccess.ReadWrite,
            bodyData: {
                walletAddress: address,
                seedPhrase
            }
        }
    ])(
        "updates already existing wallet as $access for user",
        async ({ access, bodyData }) => {
            const { prisma } = app;
            await prisma.wallet.create({
                data: {
                    address: "0x6887246668a3b87f54deb3b94ba47a6f63f32985"
                }
            });

            let res = await callAPI(app, route, {
                options: {
                    method: "POST",
                    body: JSON.stringify(bodyData)
                }
            });
            let wallet = await res.json();

            expect(wallet).toBeInstanceOf(Object);
            expect(wallet).toHaveProperty("address");
            expect(wallet.address).toBe(address);
            checkSeedPhrase(wallet, access);
            checkHiddenFields(wallet);

            await prisma.wallet.update({
                where: {
                    address
                },
                data: {
                    seedPhrase
                }
            });

            res = await callAPI(app, route, {
                options: {
                    method: "POST",
                    body: JSON.stringify(bodyData)
                }
            });
            wallet = await res.json();

            expect(wallet).toBeInstanceOf(Object);
            expect(wallet).toHaveProperty("address");
            checkSeedPhrase(wallet, access);
            checkHiddenFields(wallet);
        }
    );
});

describe(`PUT ${route}/:walletAddress`, () => {
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
        checkHiddenFields(wallet);
        expect(wallet).toHaveProperty("name");
        expect(wallet.name).toBe("Watch Wallet");

        res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    walletAddress: address,
                    seedPhrase
                })
            }
        });
        wallet = await res.json();

        expect(wallet).toBeInstanceOf(Object);
        expect(wallet).toHaveProperty("address");
        expect(wallet.address).toBe(address);
        expect(wallet).toHaveProperty("seedPhrase");
        expect(wallet.seedPhrase).toBe(seedPhrase);
        checkHiddenFields(wallet);
    });
});

describe(`DELETE ${route}/:walletAddress`, () => {
    test("returns Not Found for missing parameter", async () => {
        const res = await callAPI(app, route, {
            options: { method: "DELETE" }
        });

        expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(res.statusMessage).toBe("Not Found");
    });

    test("returns Bad Request for invalid wallet parameter", async () => {
        const res = await callAPI(app, `${route}/0x1234567890`, {
            options: {
                method: "DELETE"
            }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
        expect(res.body).toBe("Invalid wallet address");
    });

    test("receives an OK request and returns OK response", async () => {
        const { prisma } = app;
        await prisma.wallet.create({
            data: {
                address,
                rdUsers: {
                    connect: { id }
                }
            }
        });

        const res = await callAPI(app, `${route}/${address}`, {
            options: {
                method: "DELETE"
            }
        });

        expect(res.statusCode).toBe(HttpStatus.NO_CONTENT);
        expect(res.statusMessage).toBe("No Content");
    });

    test.each([
        {
            access: WalletAccess.ReadOnly,
            sampleData: {
                rdUsers: {
                    connect: { id }
                }
            }
        },
        {
            access: WalletAccess.ReadWrite,
            sampleData: {
                seedPhrase:
                    "inquiry blame advance neglect foster time debris uncover hen ten indicate dinosaur",
                rdwrUsers: {
                    connect: { id }
                }
            }
        }
    ])(
        "deletes connected $access wallet with no remaining connections",
        async ({ sampleData }) => {
            const { prisma } = app;
            await prisma.wallet.create({
                data: {
                    address,
                    ...sampleData
                }
            });

            await callAPI(app, `${route}/${address}`, {
                options: {
                    method: "DELETE"
                }
            });

            const res = await callAPI(app, route);
            const { rdWallets, rdwrWallets } = await res.json();

            expect(rdWallets).toHaveLength(0);
            expect(rdwrWallets).toHaveLength(0);

            const wallet = await prisma.wallet.findUnique({
                where: {
                    address
                }
            });

            expect(wallet).toBeNull();
        }
    );

    test.each([
        {
            access: WalletAccess.ReadOnly,
            testField: "rdUsers",
            otherField: "rdwrUsers"
        },
        {
            access: WalletAccess.ReadWrite,
            testField: "rdwrUsers",
            otherField: "rdUsers"
        }
    ])(
        "unlinks connected $access wallet with remaining connections",
        async ({ access, testField, otherField }) => {
            const { prisma } = app;
            await prisma.wallet.create({
                data: {
                    address,
                    [testField]: {
                        connect: [{ id }, { id: testDummy.data.id }]
                    }
                }
            });

            await callAPI(app, `${route}/${address}`, {
                options: {
                    method: "DELETE"
                }
            });

            let res = await callAPI(app, route);
            const { rdWallets, rdwrWallets } = await res.json();

            expect(rdWallets).toHaveLength(0);
            expect(rdwrWallets).toHaveLength(0);

            let wallet = await prisma.wallet.findUnique({
                where: {
                    address
                }
            });

            let testUserIds: "rdUserIds" | "rdwrUserIds" =
                access === WalletAccess.ReadOnly ? "rdUserIds" : "rdwrUserIds";
            let otherUserIds: "rdUserIds" | "rdwrUserIds" =
                access !== WalletAccess.ReadOnly ? "rdUserIds" : "rdwrUserIds";

            expect(wallet).toBeDefined();
            expect(wallet?.[testUserIds]).toHaveLength(1);
            expect(wallet?.[testUserIds]).toContain(testDummy.data.id);
            expect(wallet?.[otherUserIds]).toHaveLength(0);

            await prisma.wallet.update({
                where: {
                    address
                },
                data: {
                    [otherField]: {
                        connect: { id }
                    }
                }
            });

            await callAPI(app, `${route}/${address}`, {
                options: {
                    method: "DELETE"
                }
            });

            res = await callAPI(app, route);
            const { rdWallets: rdWalletsNew, rdwrWallets: rdwrWalletsNew } =
                await res.json();

            expect(rdWalletsNew).toHaveLength(0);
            expect(rdwrWalletsNew).toHaveLength(0);

            wallet = await prisma.wallet.findUnique({
                where: {
                    address
                }
            });

            testUserIds =
                access === WalletAccess.ReadOnly ? "rdUserIds" : "rdwrUserIds";
            otherUserIds =
                access !== WalletAccess.ReadOnly ? "rdUserIds" : "rdwrUserIds";

            expect(wallet).toBeDefined();
            expect(wallet?.[testUserIds]).toHaveLength(1);
            expect(wallet?.[testUserIds]).toContain(testDummy.data.id);
            expect(wallet?.[otherUserIds]).toHaveLength(0);
        }
    );
});
