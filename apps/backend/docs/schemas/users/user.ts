import { UserExample, UserSchema } from "../apiSchema";

export default {
    get: {
        schema: {
            description: "Gets user data based on supplied user id.",
            tags: ["users"],
            summary: "Gets user data.",
            params: {
                type: "object",
                properties: {
                    userId: {
                        type: "string",
                        description: "user id"
                    }
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
