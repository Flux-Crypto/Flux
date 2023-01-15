import app from "./app";

const runServer = async () => {
    const fastifyApp = await app();

    await fastifyApp.ready();
    fastifyApp.listen({ port: 8000 }, (err, address) => {
        if (err) {
            fastifyApp.log.fatal(err);
            process.exit(1);
        }
        fastifyApp.log.debug(`Server listening at ${address}`);
    });
};

runServer();
