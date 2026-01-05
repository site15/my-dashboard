# Technical Documentation for "My Dashboard" Project

## Project Overview

This repository contains two main components:
- **Mobile Application** (`/mobile`) - An Ionic-Angular mobile app with Android build capabilities
- **Web Application** (`/web`) - An AnalogJS (Angular-based) fullstack web application

## Live Demo

The application is deployed and available at: https://site15-my-dashboard.vercel.app

## Technology Stack

### Web Application
- **Framework**: AnalogJS (Angular-based fullstack framework)
- **API**: tRPC for type-safe API communication
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Pico.css and Tailwind CSS
- **Authentication**: Telegram authentication with redirect method and server-side hash verification, Supabase authentication with email/password and OAuth providers
- **Deployment**: Vercel with Neon PostgreSQL database integration

### Mobile Application
- **Framework**: Ionic-Angular with Capacitor for Android support
- **UI Components**: Ionic UI components
- **Navigation**: Tab-based navigation
- **Deployment**: Android APK build via GitHub Actions

## Current Implementation Status vs. Project Plan

### Sprint 1 (2025-11-12 – 2025-11-17)

#### Day 1 (2025-11-12) - Infrastructure and Boilerplates
**Status**: ✅ COMPLETED
- ✅ AnalogJS project initialized with tRPC and Pico.css
- ✅ Mobile application initialized with Ionic + Capacitor
- ✅ Prisma + PostgreSQL setup with schema defined
- ✅ Dev/Prod `.env` configuration
- ✅ Linters and code formatting configured

#### Day 2 (2025-11-13) - Web Registration and Anonymous Mode
**Status**: ⚠️ PARTIALLY COMPLETED
- ✅ Login page created with Telegram authentication
- ⚠️ Email/password registration not implemented
- ⚠️ Anonymous mode with localStorage not implemented
- ⚠️ User reattachment functionality not implemented

#### Day 3 (2025-11-14) - Dashboard and Widget CRUD + QR Code
**Status**: ⚠️ PARTIALLY COMPLETED
- ⚠️ Dashboard CRUD operations not fully implemented
- ⚠️ Widget CRUD operations not implemented
- ✅ QR code generation for device linking implemented
- ⚠️ Dashboard → Widgets → Device connection not fully implemented
- ✅ Prisma indexes and constraints configured

#### Day 4 (2025-11-15) - Mobile QR Code Scanning
**Status**: ❌ NOT STARTED
- ❌ QR code scanning not implemented in mobile app
- ❌ Device linking functionality not implemented
- ❌ Widget retrieval from server not implemented
- ❌ Local widget caching not implemented

#### Day 5 (2025-11-16) - Widget Display on Mobile
**Status**: ❌ NOT STARTED
- ❌ Clock widget not implemented
- ❌ Calendar widget not implemented
- ❌ Widget grid positioning not implemented
- ❌ Auto-refresh polling not implemented

#### Day 6 (2025-11-17) - Web + Mobile Integration
**Status**: ❌ NOT STARTED
- ❌ Full integration testing not performed
- ❌ Pico.css styling not finalized
- ❌ Local release preparation not completed

### Sprint 2 (2025-11-18 – 2025-11-24)

All tasks in Sprint 2 are pending implementation.

## Database Schema

The project uses Prisma ORM with PostgreSQL. The current schema includes:

### User Model
```prisma
model User {
  id               String      @id(map: "PK_USER") @default(uuid()) @db.Uuid
  anonymousId      String?
  telegramUserId   String?
  telegramUserData Json?
  supabaseUserId   String?
  supabaseUserData Json?
  isBlackTheme     Boolean?
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @default(now())
  Session          Session[]
  Dashboard        Dashboard[]

  @@unique([telegramUserId], map: "UQ_USER_TELEGRAM")
  @@unique([supabaseUserId], map: "UQ_USER_SUPABASE")
}
```

### Session Model
```prisma
model Session {
  id        String    @id(map: "PK_SESSION") @default(uuid()) @db.Uuid
  userId    String    @db.Uuid
  User      User      @relation(fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "FK_SESSION__USER_ID")
  createdAt DateTime  @default(now())
  deletedAt DateTime?

  @@index([userId], map: "IDX_SESSION__USER_ID")
}
```

### Dashboard Model
```prisma
model Dashboard {
  id           String    @id(map: "PK_DASHBOARD") @default(uuid()) @db.Uuid
  name         String
  deviceId     String?
  userId       String    @db.Uuid
  isBlackTheme Boolean?
  User         User      @relation(fields: [userId], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "FK_DASHBOARD__USER_ID")
  Widget       Widget[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @default(now())
  deletedAt    DateTime?

  @@unique([userId, name], map: "UQ_DASHBOARD__USER_ID_NAME")
  @@unique([deviceId], map: "UQ_DASHBOARD__DEVICE_ID")
  @@index([userId], map: "IDX_DASHBOARD__USER_ID")
}
```

### Widget Model
```prisma
model Widget {
  id          String @id(map: "PK_WIDGET") @default(uuid()) @db.Uuid
  options     Json?
  state       Json?
  columnIndex Int?
  rowIndex    Int?
  columnCount Int?
  rowCount    Int?

  isBlackTheme    Boolean?
  backgroundColor String?
  primaryColor    String?
  positiveColor   String?
  negativeColor   String?

  dashboardId String      @db.Uuid
  Dashboard   Dashboard   @relation(fields: [dashboardId], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "FK_WIDGET__DASHBOARD_ID")
  WidgetLog   WidgetLog[]

  createdAt DateTime  @default(now())
  updatedAt DateTime  @default(now())
  deletedAt DateTime?

  @@index([dashboardId], map: "IDX_WIDGET__DASHBOARD_ID")
}
```

### WidgetLog Model
```prisma
model WidgetLog {
  id         String @id(map: "PK_WIDGET_LOG") @default(uuid()) @db.Uuid
  oldOptions Json?
  newOptions Json?
  oldState   Json?
  newState   Json?

  widgetId  String    @db.Uuid
  Widget    Widget    @relation(fields: [widgetId], references: [id], onDelete: NoAction, onUpdate: NoAction, map: "FK_WIDGET_LOG__WIDGET_ID")
  createdAt DateTime  @default(now())
  updatedAt DateTime  @default(now())
  deletedAt DateTime?

  @@index([widgetId], map: "IDX_WIDGET_LOG__WIDGET_ID")
}
```

## API Endpoints (tRPC)

### User Routes
- `/users` - User management operations

### Telegram Routes
- `/telegram/settings` - Get Telegram authentication settings
- `/telegram/signIn` - Sign in with Telegram authentication

### Authentication Routes
- `/auth` - Authentication operations
- `/auth/supabase-sign-up` - Supabase user registration
- `/auth/supabase-sign-in` - Supabase user sign in
- `/auth/supabase-sign-out` - Supabase user sign out
- `/auth/verify-token` - Supabase token verification

### Dashboard Routes
- `/dashboards/generateQrCode` - Generate QR code for device linking

### Device Routes
- `/device/link` - Link device to dashboard using QR code

### Widget Routes
- Widget management operations (partially implemented)

### Releases Routes
- `/releases/getMobileApkUrl` - Get mobile APK download URL from GitHub releases

## Widgets Implementation

The project includes multiple widget implementations: Habits Tracking Widget, Clock Widget, and Calendar Widget. Detailed documentation for widgets is available in the [Widgets Documentation](WIDGETS_DOCUMENTATION.md) and [Widgets Documentation (Russian)](WIDGETS_DOCUMENTATION_RU.md) files.

The project also includes a release service that fetches mobile APK download URLs from GitHub releases. The service queries the GitHub API to find releases with names starting with 'mobile@' and retrieves the download URL for 'app-release-signed.apk' assets.

## Mobile Application Structure

The mobile application uses a tab-based navigation system with three main tabs:
- Tab 1: Main dashboard view
- Tab 2: Secondary features
- Tab 3: Settings or additional information

## Web Application Structure

The web application includes the following pages:
- Login page with Telegram authentication
- Dashboards list page
- Dashboard detail page
- Device linking page with QR code generation

## Development Setup

### Prerequisites
- Node.js 22.x
- PostgreSQL database (Neon recommended, or use Docker Compose for local development)
- Telegram bot for authentication (optional for local development)

### Environment Variables
The following environment variables need to be configured in `.env`:
```
MY_DASHBOARD_DATABASE_POSTGRES_URL=your_postgresql_connection_string
```

### Installation
1. Clone the repository
2. Navigate to the web directory: `cd web`
3. Install dependencies: `npm install`
4. Navigate to the mobile directory: `cd ../mobile`
5. Install dependencies: `npm install`

### Running the Applications

#### Web Application
```bash
cd web
npm start
```

#### Mobile Application
```bash
cd mobile
ionic serve
```

## Local Database Setup with Docker Compose

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

## Deployment

### Web Application
The web application is deployed to Vercel with automatic redeployment on git push. The database is integrated with Neon PostgreSQL.

### Mobile Application
The mobile application is built as an Android APK using GitHub Actions and Capacitor.

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

## Future Development Roadmap

1. Email/password registration and anonymous mode with localStorage (COMPLETED)
2. Supabase authentication with email/password and OAuth providers (COMPLETED)
3. Complete Dashboard and Widget CRUD operations
4. Implement mobile QR code scanning and device linking
5. Create widget components for mobile display
6. Implement auto-refresh polling for real-time updates
7. Add color theme support for widgets
8. Implement widget state management and logging
9. Add offline caching for mobile widgets
10. Implement user metrics and logging
11. Implement auto-refresh polling for real-time updates
12. Add color theme support for widgets
13. Implement widget state management and logging
14. Add offline caching for mobile widgets
15. Implement user metrics and logging
16. Prepare for MVP release
17. Implement dynamic mobile APK download from GitHub releases
18. Complete widget CRUD operations (COMPLETED)
19. Complete mobile QR code scanning and device linking (COMPLETED)
20. Complete widget components for mobile display (COMPLETED)
21. Complete offline caching for mobile widgets (COMPLETED)
22. Complete push notifications for mobile (COMPLETED)
23. Complete analytics and metrics collection (COMPLETED)

## Community

Join our Telegram developer community for discussions, updates, and support:
- [Telegram Developer Chat](https://t.me/site15_community)

Release information and updates are automatically posted to our Telegram community chat:
- [Telegram Release Notifications](https://t.me/site15_community/3)