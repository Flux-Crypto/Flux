import app, { HTTPMethods, callAPI } from "@test/jestHelper";
import { objectIdRegex, stubUser } from "@test/modelStubs";

import HttpStatus from "@lib/types/httpStatus";

const route = "/v1/users";
const { email } = stubUser;

// TODO: these routes (/users) should only be accessible by special authorization
// (maybe specific API key, users should not be able to access these)
describe.each([
    { route, method: "GET" as HTTPMethods },
    { route, method: "POST" as HTTPMethods }
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
    test("receves an OK request and returns OK response", async () => {
        const res = await callAPI(app, route);

        expect(res.statusCode).toEqual(HttpStatus.OK);
        expect(res.statusMessage).toBe("OK");
    });

    test("returns an array of users", async () => {
        const res = await callAPI(app, route);
        const data = await res.json();

        expect(data).toBeInstanceOf(Array);
        expect(data.length).toBeGreaterThan(0);
    });
});

describe(`POST ${route}`, () => {
    test.each([
        {
            type: "missing email",
            bodyData: {
                name: "John Doe"
            },
            responseBody: "Missing email parameter"
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

    test("receives an OK request and returns OK response", async () => {
        const res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    email
                })
            }
        });

        expect(res.statusCode).toBe(HttpStatus.CREATED);
        expect(res.statusMessage).toBe("Created");
    });

    test("returns a created user", async () => {
        const res = await callAPI(app, route, {
            options: {
                method: "POST",
                body: JSON.stringify({
                    email
                })
            }
        });
        const data = await res.json();

        expect(data).toBeInstanceOf(Object);
        expect(data).toMatchObject(stubUser);

        expect(data.id).toMatch(objectIdRegex);
        expect(data.emailVerified).toEqual(data.createdAt);
        expect(data.emailVerified).toEqual(data.updatedAt);
    });
});
