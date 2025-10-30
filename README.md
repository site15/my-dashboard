# My Dashboard

## Live Demo

The application is deployed and available at: https://site15-my-dashboard.vercel.app

## Project Overview

This repository contains two main components:
- [Mobile Application](./mobile) - An Ionic-Angular mobile app with Android build capabilities
- [Web Application](./web) - An AnalogJS (Angular-based) fullstack web application

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

## Documentation

- [Mobile App Documentation](./mobile/README.md) ([Russian version](./mobile/README_RU.md))
- [Web App Documentation](./web/README.md) ([Russian version](./web/README_RU.md))

## GitHub Actions Workflow

The repository includes a GitHub Actions workflow that automatically builds the Android APK and uploads it as an artifact.

## Vercel Integration

The web application is deployed to Vercel, which is configured to automatically listen for changes and redeploy the site whenever changes are pushed to the repository. Vercel has a native integration with Neon for database connectivity.

## Database Migrations

Database migrations are generated based on changes to the Prisma schema and applied from the local developer's computer. Migrations must be applied locally by the developer and are not automatically applied by Vercel during deployment.

## Deploying to Vercel

To deploy this project to Vercel:

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