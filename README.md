# Aurora

Making crypto finances accessible for businesses

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

First, install project dependencies

```sh
npm install
```

Login with Doppler, scoping it to this workspace directory

```sh
doppler login
```

Setup Doppler environment for local development

```sh
doppler setup
```

> Select the `dev` environment

### Running the backend

```sh
npm run dev:backend
```

Update Prisma schema after changes

```sh
npm run generate
```

Reset and seed Prisma database

```sh
npm run reset
```

### Running the frontend

```sh
npm run dev:frontend
```
