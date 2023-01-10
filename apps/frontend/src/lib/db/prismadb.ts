import { PrismaClient } from "@prisma/client";

const client = globalThis.prisma || new PrismaClient();
if (process.env.DOPPLER_ENVIRONMENT !== "prd") globalThis.prisma = client;

export default client;
