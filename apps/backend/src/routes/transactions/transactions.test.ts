import app, { HTTPMethods, callAPI, testUser } from "@test/jestHelper";
import _ from "lodash";

import HttpStatus from "@lib/types/httpStatus";
import { stubImportTransaction, uuidRegex } from "@src/test/modelStubs";

const route = "/v1/transactions";
const {
    data: { id }
} = testUser;

describe.each([
    { route, method: "GET" as HTTPMethods },
    { route, method: "POST" as HTTPMethods },
    {
        route: `${route}/63b27824cc5b18dda70b8442`,
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

    test("returns empty list if user has no transactions", async () => {
        const res = await callAPI(app, route);
        const data = await res.json();

        expect(data).toBeInstanceOf(Array);
        expect(data).toHaveLength(0);
    });

    test("returns transactions associated with user", async () => {
        const { prisma } = app;
        await prisma.user.update({
            where: {
                id
            },
            data: {
                importTransactions: stubImportTransaction
            }
        });

        const res = await callAPI(app, route);
        const data = await res.json();

        expect(data).toBeInstanceOf(Array);
        expect(data).toHaveLength(1);

        const txn = data[0];

        expect(txn).toMatchObject(_.omit(stubImportTransaction, "date"));
        expect(txn.id).toMatch(uuidRegex);
    });
});
