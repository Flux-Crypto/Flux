import { FastifyReply } from "fastify";
import { LogFn } from "pino";

export const envToLogger = {
    development: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-dd-mm, h:MM:ss TT",
                ignore: "pid,hostname",
                colorize: true
            }
        }
    },
    production: true,
    test: false
};

export const log = (
    logFn: LogFn,
    reply: FastifyReply,
    code: number,
    message: string
) => {
    logFn(message);
    reply.code(code).send(message);
};
