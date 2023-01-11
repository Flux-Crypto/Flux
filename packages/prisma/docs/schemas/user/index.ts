import { UserExample, UserSchema } from "../apiSchema";

export default {
    get: {
        description: "Gets user data.",
        tags: ["user"],
        summary: "Gets user data.",
        querystring: {
            type: "object",
            properties: {
                id: { type: "string" },
                email: { type: "string" }
            }
        },
        response: {
            "200": {
                description: "OK",
                type: "object",
                properties: UserSchema,
                example: UserExample
            },
            "400": {
                description: "Bad request. Missing id or email parameter.",
                type: "null"
            },
            "5XX": {
                description: "Unexpected error.",
                type: "null"
            }
        }
    },
    put: {
        description: "Updates user data.",
        tags: ["user"],
        summary: "Updates user data.",
        response: {
            "204": {
                description: "Successfully updated user.",
                type: "null"
            },
            "400": {
                description: "Bad request. Missing field(s) to update.",
                type: "null"
            },
            "5XX": {
                description: "Unexpected error.",
                type: "null"
            }
        }
    }
};
