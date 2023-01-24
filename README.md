# Flux

Supercharging crypto financial management for businesses

## Technologies Overview

- Backend
  - Node.js
  - TypeScript
  - Fastify
  - MongoDB (via Prisma)
- Frontend
  - TypeScript
  - React.js
  - Next.js
  - Mantine UI
  - TailwindCSS
  - Storybook

## Local Development

### Adding Dependencies

First, install project dependencies. This project is defined as a monorepo, so the global `node_modules` folder is sym-linked to the individual apps and packages.

```sh
npm install
```

To add new dependencies, run the following command based on the desired workspace to install in:

```sh
npm install <package> -w <workspace>
```

### Doppler

Doppler is the secrets manager for this application. Make sure you get added to the Doppler team to have access to the secrets. Log in with Doppler as follows:

```sh
doppler login
```

> Make sure to scope the workspace directory to the project root directory.

Set up Doppler environment for local development.

```sh
doppler setup
```

> Select the `dev` environment.

### Database

**On project initialization**, build the Prisma package with the comand:

```sh
npm run build:prisma
```

Then, generate the Prisma schema with the command:

```sh
npm run generate:local
```

> Re-run it to persist changes and update the schema.

If you want to seed the database as well (for development and testing purposes), you have two options.

1. The following command will just seed the database:

    ```sh
    npm run seed:local -w @flux/prisma
    ```

2. If you want to reset (re-generate the schema) *and* seed the Prisma database:

    ```sh
    npm run reset:local
    ```

You can view the Prisma MongoDB database using Prisma Studio. To launch it, run:

```sh
npm run studio
```

### Running the Application

If you are only developing a specific part of the application, then see the corresponding READMEs for the [Backend](apps/backend/README.md) or [Frontend](apps/frontend/README.md).

Otherwise, if you're developing fullstack, you can use the following command to start both the backend and frontend servers concurrently.

```sh
npm run dev
```

Alternatively, if you want to run the backend and frontend servers separately in different terminals, use the corresponding commands:

```sh
npm run dev:backend
```

```sh
npm run dev:frontend
```
