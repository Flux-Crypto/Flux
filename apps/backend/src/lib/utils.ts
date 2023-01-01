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

export const logSuccess = (
    reply: FastifyReply,
    code: number,
    message: string
) => {
    const successMessage = `success: ${message}`;
    console.info(`[${new Date().toISOString()}] ${successMessage}`);
    reply.code(code).send(successMessage);
};
