import fastify from "fastify";
import { prismaPlugin } from "./plugins";
import user from "./routes/user";

const server = fastify();
server.register(prismaPlugin);
const { prisma } = server;

server.register(user, { prefix: "/user" });

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

export { server, prisma };
