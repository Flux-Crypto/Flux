import { UserExample, UserSchema } from "../apiSchema";

export default {
    get: {
        schema: {
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
                    properties: { data: UserSchema },
                    example: { data: UserExample }
                },
                "400": {
                    description: "Bad request. Missing user id parameter.",
                    type: "null"
                },
                "5XX": {
                    description: "Unexpected error.",
                    type: "null"
                }
            }
        }
    },
    put: {
        schema: {
            description: "Updates user data.",
            tags: ["user"],
            summary: "Updates user data.",
            response: {
                "204": {
                    description: "Successfully updated user.",
                    type: "null"
                },
                "400": {
                    description: "Bad request. Missing user id parameter.",
                    type: "null"
                },
                "5XX": {
                    description: "Unexpected error.",
                    type: "null"
                }
            }
        }
    }
};
