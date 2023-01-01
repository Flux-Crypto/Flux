import { FastifyInstance } from "fastify";

import index from "./index";
import IndexSchema from "../../../docs/schemas/users/index.json";

const user = (server: FastifyInstance, _opts: any, done: () => void) => {
    server.register(index, IndexSchema);

    done();
};

export default user;
