# Backend

## Technologies

- Server: **Fastify**
- Database: **MongoDB**
- ORM: **Prisma**
- Secrets: **Doppler**
- Documentation: **SwaggerUI**

## Development

There are 2 main areas that you can contribute to, the API and the database. Go to the corresponding section(s) for the area(s) you're working on.

### API

To develop the API, here are a few steps to get started:

1. Create an endpoint in `src/routes`. Be sure to update route parameters in `types/routeParams.ts`.

2. If it's a new base route, register it in `index.ts`.

3. Create a `.json` schema in `docs/schemas`, naming it consistently with the route (or extend on an existing one if not a base route). Structure it according to [OpenAPI 3.0.3 standards](https://swagger.io/specification/).

    Update the `types/jsonObjects.ts` file to include the new route.

5. If you want to see the API live, make sure the backend server is running with the following command (from the root directory):

```sh
    npm run dev:backend
```

Before starting the server, make sure the above script uses the appropriate `open_docs` script. For Windows, use `open_docs_win`, and for MacOS, use `open_docs_mac`.

The script should automatically open the `/docs` page in your browser. If not, just navigate to the backend directory and run:

```sh
npm run open_docs_<os>
```

### Database

To work on the database, here's how to get started:

1. Update the `prisma/schema.prisma` file, modifying whatever you need to.

2. Run the following command (from the project root directory) to open Prisma Studio and view the live database:

```sh
    npm run studio
```

3. Run the following command (from the project root directory) to commit your changes to the Prisma schema:

```sh
    npm run generate
```

