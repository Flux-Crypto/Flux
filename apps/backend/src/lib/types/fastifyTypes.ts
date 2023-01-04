/**
 * Fastify done() type
 */
import { FastifyError } from "fastify"

export type FastifyDone = (err?: FastifyError) => void
