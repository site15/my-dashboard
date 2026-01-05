# My Dashboard

This is a comprehensive dashboard management system for displaying information on old Android phones. Users create dashboards through a web application, add widgets, and bind phones via QR code. The phone receives data through an API and displays widgets in real-time.

## Features

- Web application for creating and managing dashboards
- Mobile application for displaying widgets on Android phones
- QR code based device binding
- Real-time widget updates
- Support for multiple widget types (clock, calendar, habits tracking, counter)
- Anonymous user mode
- Telegram authentication
- Supabase authentication with email/password and OAuth providers
- Dark/light theme support
- Widget grid positioning and customization
- Mobile offline widget caching
- Dashboard sharing and templates
- API rate limiting and security features
- User analytics and reporting
- Multi-language support
- Widget marketplace and automation features

- Web application for creating and managing dashboards
- Mobile application for displaying widgets on Android phones
- QR code based device binding
- Real-time widget updates
- Support for multiple widget types (clock, calendar, habits tracking)
- Anonymous user mode
- Telegram authentication
- Supabase authentication with email/password and OAuth providers
- Dark/light theme support
- Widget grid positioning and customization
- Mobile offline widget caching
- Dashboard sharing and templates
- API rate limiting and security features
- User analytics and reporting
- Multi-language support
- Widget marketplace and automation features

## Live Demo

The application is deployed and available at: https://site15-my-dashboard.vercel.app

## Project Overview

This repository contains two main components:
- [Mobile Application](./mobile) - An Ionic-Angular mobile app with Android build capabilities
- [Web Application](./web) - An AnalogJS (Angular-based) fullstack web application

For a detailed technical specification and implementation plan, see [Project Overview](./PROJECT_OVERVIEW.md).

## Quick Start

### Mobile App
```bash
cd mobile
npm install
ionic serve
```

### Web App
```bash
cd web
npm install
npm start
```

## Local Database Setup

For local development, you can use Docker Compose to run a PostgreSQL database container. This is especially useful if you don't want to set up a cloud database for development purposes.

### Prerequisites

- Docker and Docker Compose installed on your system

### Starting the Database

To start the PostgreSQL database container, run:

```bash
cd web
docker-compose up -d
```

This will start a PostgreSQL database with the following configuration:
- Username: `postgres`
- Password: `mydashboardpassword`
- Database: `postgres`
- Port: `5432` (mapped to localhost:5432)

### Environment Configuration

After starting the database, add the following to your `web/.env` file:

```
MY_DASHBOARD_DATABASE_POSTGRES_URL=postgresql://postgres:mydashboardpassword@localhost:5432/postgres
```

### Stopping the Database

To stop the database container, run:

```bash
cd web
docker-compose down
```

### Database Persistence

The database data is persisted in a Docker volume named `my-dashboard-sql-volume`. This means your data will be preserved between container restarts.

To completely remove the data, you can remove the volume:

```bash
cd web
docker-compose down -v
```

## Documentation

- [Project Overview and Technical Specification](./PROJECT_OVERVIEW.md) ([Russian version](./PROJECT_OVERVIEW_RU.md))
- [Project Tasks Tracking](./PROJECT_TASKS.md) ([Russian version](./PROJECT_TASKS_RU.md))
- [AI Project Context](./AI_PROJECT_CONTEXT.md) ([Russian version](./AI_PROJECT_CONTEXT_RU.md))
- [Technical Documentation](./web/TECHNICAL_DOCUMENTATION.md)
- [Development Patterns](./DEVELOPMENT_PATTERNS.md)
- [UI Kit Documentation](./web/UI_KIT_DOCUMENTATION.md)
- [Mobile App Documentation](./mobile/README.md) ([Russian version](./mobile/README_RU.md))
- [Web App Documentation](./web/README.md) ([Russian version](./web/README_RU.md))
- [Widgets Documentation](./web/WIDGETS_DOCUMENTATION.md) ([Russian version](./web/WIDGETS_DOCUMENTATION_RU.md))

## Code Formatting and Linting

The web application is configured with Prettier for code formatting and ESLint for linting. See [Web App Documentation](./web/README.md#code-formatting-and-linting) for available commands.

## Community

Join our Telegram developer community for discussions, updates, and support:
- [Telegram Developer Chat](https://t.me/site15_community)

## GitHub Actions Workflow

The repository includes a GitHub Actions workflow that automatically builds the Android APK and uploads it as an artifact.

## Release Notifications

Release information and updates are automatically posted to our Telegram community chat:
- [Telegram Release Notifications](https://t.me/site15_community/3)

## Vercel Integration

The web application is deployed to Vercel, which is configured to automatically listen for changes and redeploy the site whenever changes are pushed to the repository. Vercel has a native integration with Neon for database connectivity.

## Database Migrations

Database migrations are generated based on changes to the Prisma schema and applied from the local developer's computer. Migrations must be applied locally by the developer and are not automatically applied by Vercel during deployment.

### Creating New Migrations with Custom SQL

To create a new empty migration (without changing the Prisma schema):

```bash
cd web
npx prisma migrate dev --name migration_name --create-only
```

This creates an empty migration file in the `web/prisma/migrations` directory that you can manually edit with custom SQL commands.

Example of a custom migration file:
```sql
-- Add a new column to the User table
ALTER TABLE "User" ADD COLUMN "lastLoginAt" TIMESTAMP(3);

-- Create an index on the new column
CREATE INDEX "User_lastLoginAt_idx" ON "User"("lastLoginAt");
```

### Applying Migrations

To apply pending migrations to your development database:

```bash
cd web
npx prisma migrate dev
```

For production environments, use:

```bash
cd web
npx prisma migrate deploy
```

### Working with Modified Migrations

If you've modified a migration but haven't committed it yet:

1. **If you haven't applied the migration yet:**
   - Simply edit the migration file as needed
   - Run `npx prisma migrate dev` to apply your changes

2. **If you've already applied the migration:**
   - Reset your database: `npx prisma migrate reset`
   - Edit the migration file as needed
   - Apply the migration: `npx prisma migrate dev`

3. **If you're working with a team and someone else has applied the original migration:**
   - Create a new migration with your changes: `npx prisma migrate dev --name fix_previous_migration`
   - This approach maintains consistency across team members
## Deploying to Vercel

To deploy this project to Vercel:

1. Connect your GitHub repository to Vercel
2. During the setup process, Vercel will automatically detect the environment variables
3. Add your `MY_DASHBOARD_DATABASE_POSTGRES_URL` as an environment variable in the Vercel project settings

### Applying Migrations in Vercel

To ensure database migrations are applied when deploying to Vercel, you can embed the migration command in the build process:

1. Go to your Vercel project settings: In your Vercel dashboard, select your project, then go to "Settings" > "Build & Development Settings"
2. Modify the build command: In the "Build Command" field, add the `npx prisma migrate deploy` command before your main build command:
   ```
   npx prisma migrate deploy && npm run build
   ```

This ensures that the database is migrated before the new version of your application is deployed.

## Running the Web App Locally

- Go to your project directory: `cd ./mobile`
- Run `ionic serve` within the app directory to see your app in the browser
- Run `ionic capacitor add` to add a native iOS or Android project using Capacitor
- Generate your app icon and splash screens using `cordova-res --skip-config --copy`
- Explore the Ionic docs for components, tutorials, and more: https://ion.link/docs
- Building an enterprise app? Ionic has Enterprise Support and Features: https://ion.link/enterprise-edition

## Troubleshooting

For common issues with the web application, including Telegram authentication problems, please refer to the [Web App Documentation](./web/README.md#troubleshooting).