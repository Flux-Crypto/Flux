/**
 * Fastify done() type
 */
import { User } from "@prisma/client";
import { FastifyError } from "fastify";

export type FastifyDone = (err?: FastifyError) => void;

/**
 * JWT
 */
export interface JWT {
    email: string;
    sub: string;
    user: User;
    iat: number;
    exp: number;
    jti: string;
}
