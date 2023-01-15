import app, { HTTPMethods, callAPI, testUser } from "@test/jestHelper";
import { stubUser } from "@test/modelStubs";

import HttpStatus from "@lib/types/httpStatus";

const route = "/v1/user";

describe.each([
    { route, method: "GET" as HTTPMethods },
    { route, method: "PUT" as HTTPMethods }
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

    test("returns the associated user", async () => {
        const res = await callAPI(app, route);
        const { data } = await res.json();

        expect(data).toBeInstanceOf(Object);
        expect(data).toMatchObject(testUser.data);
        expect(data.apiKey).toBeFalsy();
        expect(data.exchangeAPIKeys).toHaveLength(0);
        expect(data.processorAPIKeys).toHaveLength(0);
    });
});

describe(`PUT ${route}`, () => {
    test("returns Bad Request for missing body", async () => {
        const res = await callAPI(app, route, {
            options: { method: "PUT" }
        });

        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(res.statusMessage).toBe("Bad Request");
    });

    test.failing.each([
        {
            type: "invalid field",
            bodyData: {
                name: "John Doe"
            },
            responseBody: "Invalid field"
        },
        {
            type: "invalid email",
            bodyData: {
                email: "johndoe@"
            },
            responseBody: "Not a valid email"
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

    test.todo("prevent updating api key");

    test("receives an OK request and returns OK response", async () => {
        const res = await callAPI(app, route, {
            options: {
                method: "PUT",
                body: JSON.stringify({
                    firstName: "alice",
                    lastName: "bob",
                    email: "johndoe@email.com",
                    exchangeAPIKeys: ["abcdef123"],
                    processorAPIKeys: ["uvwxyz456"]
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.NO_CONTENT);
        expect(res.statusMessage).toBe("No Content");
        expect(res.body).toBeFalsy();
    });

    test.todo("incorporate other User fields");

    test("updates user information based on requested changes", async () => {
        await callAPI(app, route, {
            options: {
                method: "PUT",
                body: JSON.stringify({
                    firstName: "alice",
                    lastName: "bob",
                    email: "johndoe@email.com",
                    exchangeAPIKeys: ["abcdef123"],
                    processorAPIKeys: ["uvwxyz456"]
                })
            }
        });

        const res = await callAPI(app, route);
        const { data } = await res.json();

        expect(data).toBeInstanceOf(Object);
        expect(data).not.toMatchObject(stubUser);

        expect(data.id).toMatch(/^[a-f\d]{24}$/i);
        expect(data.firstName).toBe("alice");
        expect(data.lastName).toBe("bob");
        expect(data.email).toBe("johndoe@email.com");
        expect(data.emailVerified).toEqual(data.createdAt);
        expect(data.emailVerified).toEqual(data.updatedAt);
        // TODO: add check for apiKey not changing
        expect(data.exchangeAPIKeys).toContain("abcdef123");
        expect(data.processorAPIKeys).toContain("uvwxyz456");
    });

    test.todo("more complex behavior, like updating lists");
    test.todo("validating api keys, etc.");
});
