# my-dashboard

This project was generated with [Analog](https://analogjs.org), the fullstack meta-framework for Angular.

## Live Demo

The application is deployed and available at: https://site15-my-dashboard.vercel.app

## Setup

Run `npm install` to install the application dependencies.

## Community

Join our Telegram developer community for discussions, updates, and support:
- [Telegram Developer Chat](https://t.me/site15_community)

## Release Notifications

Release information and updates are automatically posted to our Telegram community chat:
- [Telegram Release Notifications](https://t.me/site15_community/3)

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

## Telegram Authentication

This application uses Telegram authentication with the redirect method and hash verification on the server side. The implementation follows the approach described in [Telegram Login with Node.js](https://edisonchee.com/writing/telegram-login-with-node.js/).

There are several ways to implement Telegram login:
1. **Telegram Login Widget** - Provides a "Log in with Telegram" button which triggers a pop-up for the OAuth flow
2. **Seamless Web Bots** - Allows login by tapping an inline keyboard button from a bot
3. **Redirect URL method** - Uses data-auth-url instead of data-onauth to receive data on a backend server

This application uses the Redirect URL method. The authentication flow works as follows:
1. User clicks the Telegram Login button on the website
2. User is redirected to Telegram for authentication
3. After successful authentication, Telegram redirects back to the application with user data and a hash
4. The server verifies the hash to ensure the data is authentic using cryptographic verification:
   - Create a hash of a secret (bot token) known to both the application and Telegram
   - Sort the user data parameters and create a data check string
   - Run a cryptographic hash function over the data check string and the secret
   - Compare the calculated hash with the hash received from Telegram
5. If verification is successful, user data is stored in the database

Since Telegram requires a domain for this authentication to work, you need to use a tunneling service like [ngrok](https://ngrok.com/) or [tuna](https://tuna.am/) for local development. The current project uses [tuna](https://tuna.am/) for this purpose.

To use tuna for local development with Telegram authentication:
```bash
tuna http 5173
```

This command will create a tunnel to your local development server running on port 5173, providing you with a public URL that can be used with Telegram's authentication system.

## Troubleshooting

### "Bot domain invalid" Error with Telegram Login

If the Telegram login button displays "Bot domain invalid" instead of showing the login dialog, you need to configure your bot's domain settings:

1. Run the tunneling service using the command:
   ```bash
   tuna http 5173
   ```
   
2. Once executed, the command will display a public URL (example: `https://3zpmpk-46-191-177-220.ru.tuna.am`)

3. Take this URL and set it as your bot's domain using BotFather:
   - Open a chat with [@BotFather](https://t.me/BotFather) in Telegram
   - Send the `/setdomain` command
   - Select your bot from the list
   - Enter the public URL provided by the tuna command

This configuration is necessary because Telegram requires a valid domain for the authentication mechanism to work properly during local development.

### "Blocked request" Error with Vite Development Server

If you see an error message like `Blocked request. This host ("3zpmpk-46-191-177-220.ru.tuna.am") is not allowed.` or a similar message when accessing your application through the tuna tunnel, it means you need to add the domain name to the Vite configuration.

The Vite development server has a security feature that blocks requests from unknown hosts. When using a tunneling service like tuna, you need to explicitly allow the generated domain.

This has already been configured in the [vite.config.ts](vite.config.ts) file with the following configuration:

```javascript
server: {
  allowedHosts: ['3zpmpk-46-191-177-220.ru.tuna.am', 'localhost'],
}
```

If you encounter this error with a different domain, you can add it to the `allowedHosts` array in the [vite.config.ts](vite.config.ts) file.

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