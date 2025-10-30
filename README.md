# My Dashboard

## Building the Mobile Web of Mobile App

```bash
./node_modules/.bin/ionic build --prod
```

## Generating Keystore for Android Build

```bash
keytool -genkey -v -keystore my-dashboard.jks -alias my-dashboard -keyalg RSA -keysize 2048 -validity 10000
```

## Building Android APK with Docker

### Using Pre-built Docker Image

```bash
cd mobile
docker run --rm -v "$(pwd)":/app endykaufman/ionic-capacitor:latest
```

### Building and Using Custom Docker Image

```bash
cd mobile
docker build -t endykaufman/ionic-capacitor .
docker run --rm -v "$(pwd)":/app endykaufman/ionic-capacitor
```

The APK will be generated at: `mobile/android/app/build/outputs/apk/release/app-release.apk`

## Database Setup

This project uses a PostgreSQL database with Prisma as the ORM. We recommend using [Neon](https://neon.tech/) for cloud hosting as it provides a generous free tier and doesn't go to sleep like some other free options.

To set up the database:

1. Create a database in the cloud with [Neon](https://neon.tech/)
2. Copy the connection string to your `.env` file in the `web` directory:
   ```
   MY_DASHBOARD_DATABASE_POSTGRES_URL=your_neon_connection_string_here
   ```

Alternative database options:
- [Supabase](https://supabase.com/) - Can go to sleep on the free tier
- [CockroachCloud](https://www.cockroachlabs.com/) - Has a trial period

Neon is recommended because it provides a good balance of features, performance, and cost for development.

## Prisma Engines Mirror

When installing Node.js dependencies, you may encounter issues with Prisma engines being blocked by firewalls or region restrictions. To resolve this, set the following environment variable before installing dependencies:

```bash
export PRISMA_ENGINES_MIRROR=https://registry.npmmirror.com/-/binary/prisma
```

This will redirect Prisma engine downloads to a mirror that is more accessible from certain regions.

## GitHub Actions Workflow

The repository includes a GitHub Actions workflow that automatically builds the Android APK and uploads it as an artifact.

## Deploying to Vercel

This project can be deployed to Vercel. Vercel has a native integration with Neon, making it easy to connect your database:

1. Connect your GitHub repository to Vercel
2. During the setup process, Vercel will automatically detect the environment variables
3. Add your `MY_DASHBOARD_DATABASE_POSTGRES_URL` as an environment variable in the Vercel project settings

## Running the Web App Locally

- Go to your project directory: `cd ./mobile`
- Run `ionic serve` within the app directory to see your app in the browser
- Run `ionic capacitor add` to add a native iOS or Android project using Capacitor
- Generate your app icon and splash screens using `cordova-res --skip-config --copy`
- Explore the Ionic docs for components, tutorials, and more: https://ion.link/docs
- Building an enterprise app? Ionic has Enterprise Support and Features: https://ion.link/enterprise-edition