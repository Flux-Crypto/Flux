import build from "../../test/jestHelper";

const app = build();

// TODO: hide in env var
const apiKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlAYS5jb20iLCJzdWIiOiI2M2I3OWYyZGJlMjM3YTkxMjg3Y2FiYmUiLCJ1c2VyIjp7ImlkIjoiNjNiNzlmMmRiZTIzN2E5MTI4N2NhYmJlIiwiZW1haWwiOiJpQGEuY29tIiwiZW1haWxWZXJpZmllZCI6IjIwMjMtMDEtMDZUMDQ6MTA6MjguODk2WiIsImZpcnN0TmFtZSI6IiIsImxhc3ROYW1lIjoiIiwiYXBpS2V5IjoiIiwicHJvY2Vzc29yQVBJS2V5cyI6W10sImV4Y2hhbmdlQVBJS2V5cyI6W10sInJkV2FsbGV0QWRkcmVzc2VzIjpbXSwicmR3cldhbGxldEFkZHJlc3NlcyI6W10sIndhbGxldE5hbWVzIjpbXSwiaW1wb3J0VHJhbnNhY3Rpb25zIjpbXSwiY2hhaW5UcmFuc2FjdGlvbnMiOltdLCJjcmVhdGVkQXQiOiIyMDIzLTAxLTA2VDA0OjEwOjIxLjc0OFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTAxLTA2VDA0OjEwOjIxLjc0OFoifSwiaWF0IjoxNjczMzA4MTQ4LCJleHAiOjE2NzM5MTI5NDgsImp0aSI6IjUwNTYxY2I3LTEzNTctNGYxYi1iZWVlLThhMGNjMDNmMjlhNCJ9.cYda8V6lmQ4FEu8ls7K4IkRnuhiKLWpoGUIRvCtpPsY";

describe("unauthorized", () => {
    test("it has status code 400 and message", async () => {
        const res = await app.inject({
            url: "/api/v1/users"
        });

        expect(res.statusCode).toEqual(400);
        expect(res.statusMessage).toBe("Bad Request");
    });
});

describe("OK request and response", () => {
    test("it has OK response", async () => {
        const res = await app.inject({
            url: "/api/v1/users",
            headers: {
                Authorization: `Bearer ${apiKey}`
            }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.statusMessage).toBe("OK");
    });

    test("it returns an array of users", async () => {
        const res = await app.inject({
            url: "/api/v1/users",
            headers: {
                Authorization:
                    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlAYS5jb20iLCJzdWIiOiI2M2I3OWYyZGJlMjM3YTkxMjg3Y2FiYmUiLCJ1c2VyIjp7ImlkIjoiNjNiNzlmMmRiZTIzN2E5MTI4N2NhYmJlIiwiZW1haWwiOiJpQGEuY29tIiwiZW1haWxWZXJpZmllZCI6IjIwMjMtMDEtMDZUMDQ6MTA6MjguODk2WiIsImZpcnN0TmFtZSI6IiIsImxhc3ROYW1lIjoiIiwiYXBpS2V5IjoiIiwicHJvY2Vzc29yQVBJS2V5cyI6W10sImV4Y2hhbmdlQVBJS2V5cyI6W10sInJkV2FsbGV0QWRkcmVzc2VzIjpbXSwicmR3cldhbGxldEFkZHJlc3NlcyI6W10sIndhbGxldE5hbWVzIjpbXSwiaW1wb3J0VHJhbnNhY3Rpb25zIjpbXSwiY2hhaW5UcmFuc2FjdGlvbnMiOltdLCJjcmVhdGVkQXQiOiIyMDIzLTAxLTA2VDA0OjEwOjIxLjc0OFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTAxLTA2VDA0OjEwOjIxLjc0OFoifSwiaWF0IjoxNjczMzA4MTQ4LCJleHAiOjE2NzM5MTI5NDgsImp0aSI6IjUwNTYxY2I3LTEzNTctNGYxYi1iZWVlLThhMGNjMDNmMjlhNCJ9.cYda8V6lmQ4FEu8ls7K4IkRnuhiKLWpoGUIRvCtpPsY"
            }
        });

        const data = await res.json();
        expect(data).toBeInstanceOf(Array);
    });
});
