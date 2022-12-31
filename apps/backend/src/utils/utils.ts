import { FastifyReply } from "fastify";

export const logError = (
    reply: FastifyReply,
    code: number,
    message: string
) => {
    const errorMessage = `error: ${message}`;
    console.error(`[${new Date().toISOString()}] ${errorMessage}`);
    reply.code(code).send(errorMessage);
};
