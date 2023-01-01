# Aurora

Making crypto finances accessible for businesses.

## Services and Technologies

- Backend
  - Node.js
  - TypeScript
  - Fastify
  - MongoDB w/ Prisma
- Frontend
  - TypeScript
  - React.js
  - Next.js
  - TailwindCSS

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

Doppler is the secrets manager for this application. Make sure you get invited to the Doppler team to have access to the secrets. Log in with Doppler as follows:

```sh
doppler login
```

> Make sure to scope the workspace directory to the project root directory.

Set up Doppler environment for local development.

```sh
doppler setup
```

> Select the `dev` environment.

### Running the Backend

```sh
npm run dev:backend
```

### Database

**On project initialization**, generate the Prisma schema with the command:

```sh
npm run generate
```

> Re-run it to persist changes and update the schema.

To reset and seed Prisma database:

```sh
npm run reset
```

You can view the Prisma MongoDB database using Prisma Studio. To launch it:

```sh
npm run studio
```

### Running the Frontend

```sh
npm run dev:frontend
```
