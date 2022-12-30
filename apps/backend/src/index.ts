import fastify from "fastify"
import { prisma } from "./plugins"

const server = fastify()
server.register(prisma)

server.get("/ping", async (_request, _reply) => {
    return "pong\n";
});

server.listen({ port: 8000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
