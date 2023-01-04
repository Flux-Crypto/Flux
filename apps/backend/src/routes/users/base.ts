import { FastifyInstance, FastifyServerOptions } from "fastify"

import { FastifyDone } from "@src/lib/types/fastifyTypes"

import IndexSchema from "@docs/schemas/users"
import TransactionsSchema from "@docs/schemas/users/transactions"
import UserSchema from "@docs/schemas/users/user"
import WalletsSchema from "@docs/schemas/users/wallets"

import indexRoute from "./index"
import transactionsRoute from "./transactions"
import userRoute from "./user"
import walletsRoute from "./wallets"

const users = (
    server: FastifyInstance,
    _opts: FastifyServerOptions,
    done: FastifyDone
) => {
    server.register(indexRoute, IndexSchema)
    server.register(userRoute, { prefix: "/:userId", ...UserSchema })
    server.register(walletsRoute, {
        prefix: "/:userId/wallets",
        ...WalletsSchema
    })
    server.register(transactionsRoute, {
        prefix: "/:userId/transactions",
        ...TransactionsSchema
    })

    done()
}

export default users
