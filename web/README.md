# my-dashboard

This project was generated with [Analog](https://analogjs.org), the fullstack meta-framework for Angular.

## Live Demo

The application is deployed and available at: https://site15-my-dashboard.vercel.app

## Setup

Run `npm install` to install the application dependencies.

## Database Setup

This project uses a PostgreSQL database. We recommend using [Neon](https://neon.tech/) for cloud hosting as it provides a generous free tier and doesn't go to sleep like some other free options.

To set up the database:

1. Create a database in the cloud with [Neon](https://neon.tech/)
2. Copy the connection string to your `.env` file:
   ```
   MY_DASHBOARD_DATABASE_POSTGRES_URL=your_neon_connection_string_here
   ```

Alternative database options:
- [Supabase](https://supabase.com/) - Can go to sleep on the free tier
- [CockroachCloud](https://www.cockroachlabs.com/) - Has a trial period

Neon is recommended because it provides a good balance of features, performance, and cost for development.

## Database Migrations

Database migrations are generated based on changes to the Prisma schema and applied from the local developer's computer:

1. Modify the `prisma/schema.prisma` file to make changes to your database structure
2. Run `./node_modules/.bin/prisma migrate dev` to generate and apply migrations locally
3. Commit the generated migration files to version control

Note: Migrations must be applied locally by the developer and are not automatically applied by Vercel during deployment.

## Prisma Setup

This project uses Prisma as the ORM. After setting up your database:

1. Install `dotenv` and add `import "dotenv/config";` to your `prisma.config.ts` file to load environment variables from `.env`:
   ```typescript
   import "dotenv/config";
   import { defineConfig, env } from "prisma/config";
   
   export default defineConfig({
     // ... existing config
   });
   ```

2. Define your models in the `prisma/schema.prisma` file.

3. Run `./node_modules/.bin/prisma migrate dev` to migrate your database.

Note: Environment variables declared in the `.env` file are NOT automatically loaded by Prisma. You must explicitly import `dotenv/config`.

## Prisma Engines Mirror

When installing Node.js dependencies, you may encounter issues with Prisma engines being blocked by firewalls or region restrictions. To resolve this, set the following environment variable before installing dependencies:

```bash
export PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma
```

This will redirect Prisma engine downloads to a mirror that is more accessible from certain regions.

## Deploying to Vercel

This project can be deployed to Vercel. Vercel has a native integration with Neon, making it easy to connect your database:

1. Connect your GitHub repository to Vercel
2. During the setup process, Vercel will automatically detect the environment variables
3. Add your `MY_DASHBOARD_DATABASE_POSTGRES_URL` as an environment variable in the Vercel project settings

Vercel is configured to automatically listen for changes and redeploy the site whenever changes are pushed to the repository.

## Development

Run `npm start` for a dev server. Navigate to `http://localhost:5173/`. The application automatically reloads if you change any of the source files.

## Build

Run `npm run build` to build the client/server project. The client build artifacts are located in the `dist/analog/public` directory. The server for the API build artifacts are located in the `dist/analog/server` directory.

## Test

Run `npm run test` to run unit tests with [Vitest](https://vitest.dev).

## Community

- Visit and Star the [GitHub Repo](https://github.com/analogjs/analog)
- Join the [Discord](https://chat.analogjs.org)
- Follow us on [Twitter](https://twitter.com/analogjs)
- Become a [Sponsor](https://github.com/sponsors/brandonroberts)