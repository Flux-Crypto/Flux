import { FastifyReply } from "fastify";

export const envToLogger = {
    dev: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-dd-mm, h:MM:ss TT",
                ignore: "pid,hostname",
                colorize: true
            }
        }
    },
    stg: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-dd-mm, h:MM:ss TT",
                ignore: "pid,hostname",
                colorize: true,
                level: "warn"
            }
        }
    },
    prd: {
        transport: {
            target: "pino-pretty",
            options: {
                translateTime: "yyyy-dd-mm, h:MM:ss TT",
                ignore: "pid,hostname",
                colorize: true,
                level: "warn"
            }
        }
    },
    test: false
};

export const logAndSendReply = (
    logFn: any,
    reply: FastifyReply,
    code: number,
    message: string
) => {
    logFn(message);
    reply.code(code).send(message);
};
