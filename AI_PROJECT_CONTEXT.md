# AI Project Context Document

This document provides comprehensive context for AI systems to understand the "My Dashboard" project. It includes project goals, architecture, technology stack, current implementation status, and links to detailed documentation.

## Project Overview

**Project Name**: My Dashboard
**Description**: A dashboard management system for displaying information on old Android phones. Users create dashboards through a web application, add widgets, and bind phones via QR code. The phone receives data through an API and displays widgets in real-time.
**Live Demo**: https://site15-my-dashboard.vercel.app

## Project Structure

The project consists of two main components:

1. **Mobile Application** (`/mobile`)
   - Framework: Ionic-Angular with Capacitor for Android support
   - Build system: Ionic + Capacitor
   - Target platform: Android
   - Navigation: Tab-based (tab1, tab2, tab3)

2. **Web Application** (`/web`)
   - Framework: AnalogJS (Angular-based fullstack framework)
   - Backend: Server routes in `/src/server`
   - Database: Prisma ORM with PostgreSQL
   - API: tRPC for type-safe communication
   - Deployment: Vercel

## Technology Stack

### Web Application
- **Frontend**: AnalogJS, Angular, tRPC client
- **Backend**: AnalogJS server routes, tRPC server
- **Database**: Prisma ORM, PostgreSQL
- **Styling**: Pico.css, Tailwind CSS
- **Authentication**: Telegram OAuth
- **Deployment**: Vercel

### Mobile Application
- **Framework**: Ionic-Angular
- **Native Integration**: Capacitor
- **UI Components**: Ionic UI library
- **Target**: Android

### Shared Technologies
- **Language**: TypeScript
- **Build Tool**: npm
- **Testing**: Vitest
- **Database**: PostgreSQL (Neon recommended)

## Database Schema

See detailed schema in [schema.prisma](./web/prisma/schema.prisma):

- **User**: id, anonymousId, telegramUserId, telegramUserData, isBlackTheme, Session[], Dashboard[]
- **Session**: id, userId, createdAt, deletedAt
- **Dashboard**: id, name, deviceId, userId, isBlackTheme, Widget[]
- **Widget**: id, options (JSON), state (JSON), grid positioning, colors, dashboardId
- **WidgetLog**: id, oldOptions, newOptions, oldState, newState, widgetId

## Current Implementation Status

### Completed Components
1. Project infrastructure (AnalogJS, Ionic, Prisma)
2. Database schema implementation
3. Telegram authentication system
4. Basic web UI (login, dashboard list, dashboard view, device linking)
5. QR code generation for device linking
6. Vercel deployment configuration
7. GitHub Actions workflow for mobile builds

### Pending Components
1. Email/password registration
2. Anonymous mode with localStorage
3. User reattachment functionality
4. Full Dashboard CRUD operations
5. Widget CRUD operations
6. Mobile QR code scanning
7. Widget display components on mobile
8. Real-time widget updates
9. Widget state management
10. Offline caching for mobile
11. Usage metrics collection

## Development Plan

See detailed task tracking in:
- [PROJECT_TASKS.md](./PROJECT_TASKS.md) (English)
- [PROJECT_TASKS_RU.md](./PROJECT_TASKS_RU.md) (Russian)

### Sprint 1 (2025-11-12 – 2025-11-17)
Focus: Complete core functionality for basic dashboard management

### Sprint 2 (2025-11-18 – 2025-11-24)
Focus: Implement mobile application and full integration

## Key Files and Directories

### Web Application
- [schema.prisma](./web/prisma/schema.prisma) - Database schema
- [vite.config.ts](./web/vite.config.ts) - Vite configuration
- [package.json](./web/package.json) - Dependencies and scripts
- [src/app/](./web/src/app/) - Frontend components
- [src/server/](./web/src/server/) - Backend routes and logic
- [src/server/trpc/routers/](./web/src/server/trpc/routers/) - tRPC API endpoints

### Mobile Application
- [capacitor.config.ts](./mobile/capacitor.config.ts) - Capacitor configuration
- [ionic.config.json](./mobile/ionic.config.json) - Ionic configuration
- [package.json](./mobile/package.json) - Dependencies and scripts
- [src/app/](./mobile/src/app/) - Application source code

## API Endpoints

### tRPC Routes
- `/users` - User management
- `/telegram` - Telegram authentication
- `/auth` - Authentication operations
- `/dashboards` - Dashboard operations
- `/widgets` - Widget operations

See implementation in [src/server/trpc/routers/](./web/src/server/trpc/routers/)

## Authentication System

The web application uses Telegram authentication with:
- Redirect method
- Server-side hash verification
- Tunneling via tuna.am for local development

See [Telegram Authentication Integration](./web/README.md#telegram-authentication) for details.

## Development Environment

### Prerequisites
- Node.js 22.x
- PostgreSQL database (Neon recommended)
- Telegram bot for authentication (optional for local development)

### Environment Variables
```
MY_DASHBOARD_DATABASE_POSTGRES_URL=postgresql_connection_string
```

### Running Applications

#### Web Application
```bash
cd web
npm install
npm start
```

#### Mobile Application
```bash
cd mobile
npm install
ionic serve
```

## Deployment

### Web Application
- Platform: Vercel
- Database: Neon PostgreSQL (native integration)
- URL: https://site15-my-dashboard.vercel.app

### Mobile Application
- Platform: Android APK
- Build: GitHub Actions workflow
- Distribution: Manual

## Detailed Documentation

For comprehensive project information, refer to:
- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Technical specification and implementation plan
- [TECHNICAL_DOCUMENTATION.md](./web/TECHNICAL_DOCUMENTATION.md) - Detailed technical documentation
- [README.md](./README.md) - Root project documentation
- [web/README.md](./web/README.md) - Web application documentation
- [mobile/README.md](./mobile/README.md) - Mobile application documentation

## Troubleshooting

Common issues and solutions:
1. "Bot domain invalid" - Configure bot domain via BotFather
2. "Blocked request" - Add domain to vite.config.ts allowedHosts

See [Troubleshooting](./web/README.md#troubleshooting) for detailed solutions.