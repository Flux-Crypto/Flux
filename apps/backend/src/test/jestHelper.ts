import app from "../app";

const build = () => {
    const fastifyApp = app();

    beforeAll(async () => {
        await fastifyApp.listen();
    });

    afterAll(() => fastifyApp.close());

    return fastifyApp;
};

export default build;
