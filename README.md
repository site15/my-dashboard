# My Dashboard

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

## Documentation

- [Project Overview and Technical Specification](./PROJECT_OVERVIEW.md)
- [Project Tasks Tracking](./PROJECT_TASKS.md)
- [AI Project Context](./AI_PROJECT_CONTEXT.md) ([Russian version](./AI_PROJECT_CONTEXT_RU.md))
- [Technical Documentation](./web/TECHNICAL_DOCUMENTATION.md)
- [Mobile App Documentation](./mobile/README.md) ([Russian version](./mobile/README_RU.md))
- [Web App Documentation](./web/README.md) ([Russian version](./web/README_RU.md))

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

## Troubleshooting

For common issues with the web application, including Telegram authentication problems, please refer to the [Web App Documentation](./web/README.md#troubleshooting).