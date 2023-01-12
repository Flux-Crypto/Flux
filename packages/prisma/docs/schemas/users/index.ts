import { UserExample, UserSchema } from "../apiSchema";

export default {
    get: {
        description: "Gets users data.",
        tags: ["users"],
        summary: "Gets users data.",
        response: {
            "200": {
                description: "OK",
                type: "array",
                items: { type: "object", properties: UserSchema },
                example: [UserExample]
            },
            "5XX": {
                description: "Unexpected error.",
                type: "null"
            }
        }
    },
    post: {
        description: "Creates a new user based on supplied email.",
        tags: ["users"],
        summary: "Creates new user.",
        body: {
            type: "object",
            properties: {
                email: {
                    type: "string",
                    description: "user email"
                }
            }
        },
        response: {
            "201": {
                description: "Successful creation.",
                type: "object",
                properties: UserSchema,
                example: UserExample
            },
            "400": {
                description: "Bad request. Missing email parameter.",
                type: "null"
            },
            "5XX": {
                description: "Unexpected error.",
                type: "null"
            }
        }
    }
};
