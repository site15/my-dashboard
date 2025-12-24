# Project Overview: "My Dashboard"

## Technical Specification

### Project Goal
Creating a dashboard management system for displaying information on old Android phones. Users create dashboards through a web application, add widgets, and bind phones via QR code. The phone receives data through an API and displays widgets in real-time.

### Main Components

#### 1. Web Application (AnalogJS + tRPC + Pico.css)
- User registration and anonymous mode with identifier storage in localStorage
- Creation, editing, and deletion of dashboards
- Addition, configuration, and deletion of widgets (clocks, calendar)
- QR code generation for phone binding
- Reattachment of anonymous users during subsequent registration
- UX and SEO: "Continue as Guest" button, meta tags for dashboards

#### 2. Mobile Application (Ionic + Capacitor)
- QR code scanning to bind phone to dashboard
- Retrieving widget list from server via tRPC API
- Displaying widgets: clock with timezone and name, calendar with fixed month and date
- Automatic widget updates
- Offline widget caching support
- Minimal interface: display only, no editing

#### 3. Backend (NestJS + Prisma + PostgreSQL)
**Database Models (schema from schema.prisma):**
- **User**: id, anonymousId, telegramUserId, isBlackTheme, Session[], Dashboard[]
- **Session**: id, userId, createdAt, deletedAt
- **Dashboard**: id, name, deviceId, userId, isBlackTheme, Widget[]
- **Widget**: id, options (JSON), state (JSON), grid (columnIndex, rowIndex, columnCount, rowCount), colors, dashboardId
- **WidgetLog**: id, oldOptions, newOptions, oldState, newState, widgetId

**tRPC Endpoints:**
- `/user/register` – user registration
- `/user/login` – login
- `/dashboards/create` / `/dashboards/update` / `/dashboards/delete` / `/dashboards/get`
- `/widgets/create` / `/widgets/update` / `/widgets/delete` / `/widgets/get`
- `/devices/link` – phone binding via QR code
- `/devices/widgets` – getting widgets for phone
- Logging widget changes in WidgetLog
- Anonymous users: localStorage stores identifier, reattachment during registration

### Functional Requirements

#### 1. Registration and Anonymous Mode
- Email/password registration
- Anonymous mode with identifier in localStorage
- Reattachment of anonymous identifier to registered account

#### 2. Dashboards
- Creation, editing, deletion
- Name, theme (light/dark), phone binding (deviceId)
- Uniqueness of name within user scope

#### 3. Widgets
- Types: clock, calendar
- Parameters:
  - Clock: timeZone, name
  - Calendar: fixed month and date
- Display options: color scheme (isBlackTheme, backgroundColor, primaryColor, positiveColor, negativeColor), grid position (columnIndex, rowIndex, columnCount, rowCount)
- Widget state stored in JSON (Widget.state)
- Change history (WidgetLog)

#### 4. Phones
- Binding to dashboard via QR code
- Getting widgets from server via tRPC
- Auto-update when data changes on server
- Displaying widgets without editing capability

#### 5. Web + Mobile Application Integration
- Web manages dashboards and widgets
- Mobile application displays only server data
- Widget updates instantly visible on phone

### Non-Functional Requirements
- Support for older Android versions
- Performance: widget caching on phone
- UX: convenient interface for binding and viewing dashboards
- SEO: meta tags for web dashboard pages
- Logs and usage metrics: phone binding, number of dashboards, widget views

### Project Architecture
```
[Web Application (AnalogJS + tRPC + Pico.css)]
|
| tRPC API
v
[Backend NestJS + Prisma + PostgreSQL]
|
| tRPC API
v
[Mobile Application Ionic + Capacitor]
```

### Additional Features
- Ability to add new widgets in the future
- Option to prohibit phone reattachment to other users
- Support for dark and light themes for dashboards and widgets
- Offline widget viewing capability on phone

### Documentation Links
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [AnalogJS Docs](https://analogjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Ionic Framework Docs](https://ionicframework.com/docs)
- [Pico.css](https://picocss.com/)

## Current Implementation Status

### Completed Components
1. **Project Infrastructure**
   - ✅ AnalogJS web application with tRPC integration
   - ✅ Ionic mobile application with Capacitor for Android
   - ✅ Prisma ORM with PostgreSQL database schema
   - ✅ Vercel deployment configuration
   - ✅ GitHub Actions workflow for mobile builds

2. **Authentication System**
   - ✅ Telegram authentication with server-side verification
   - ✅ Tunneling setup for local development (tuna.am)

3. **Database Schema**
   - ✅ All required models implemented (User, Session, Dashboard, Widget, WidgetLog)
   - ✅ Proper relationships and constraints configured
   - ✅ Indexes and unique constraints implemented

4. **Basic Web UI**
   - ✅ Login page with Telegram authentication
   - ✅ Dashboard listing page
   - ✅ Dashboard detail page
   - ✅ Device linking page with QR code generation

### Completed Components
1. **User Management**
   - ✅ Telegram authentication with server-side verification
   - ✅ Anonymous mode with localStorage
   - ✅ User reattachment functionality
   - ✅ Email/password registration

2. **Dashboard Management**
   - ✅ Full CRUD operations for dashboards
   - ✅ Dashboard creation workflow
   - ✅ Dashboard editing capabilities
   - ✅ Dashboard sharing and templates

3. **Widget Management**
   - ✅ Full Widget CRUD operations
   - ✅ Implementation of Habits Tracking Widget
   - ✅ Widget configuration interface
   - ✅ Widget grid positioning
   - ✅ Multiple widget types (clock, calendar, habits tracking, weather, news, etc.)

4. **Mobile Application**
   - ✅ QR code scanning functionality
   - ✅ Device binding to dashboards
   - ✅ Widget display components
   - ✅ Offline caching implementation
   - ✅ Mobile-specific UI enhancements
   - ✅ Push notifications

5. **Integration Features**
   - ✅ Real-time widget updates
   - ✅ Widget state management
   - ✅ Change logging (WidgetLog)
   - ✅ Usage metrics collection
   - ✅ API rate limiting and security features
   - ✅ Third-party API integrations
   - ✅ Webhook support

## Development Plan

### Sprint 1 (2025-11-12 – 2025-11-17)
Focus: Complete core functionality for basic dashboard management

### Sprint 2 (2025-11-18 – 2025-11-24)
Focus: Implement mobile application and full integration

## Technology Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend (Web) | AnalogJS, Angular, tRPC, Pico.css, Tailwind CSS |
| Frontend (Mobile) | Ionic, Angular, Capacitor |
| Backend | AnalogJS server routes, tRPC, Prisma ORM |
| Database | PostgreSQL (Neon recommended) |
| Deployment | Vercel (web), GitHub Actions (mobile) |
| Authentication | Telegram OAuth |

## Project Links

- **Live Demo**: https://site15-my-dashboard.vercel.app
- **Repository**: [site15/my-dashboard](https://github.com/site15/my-dashboard)
- **Community**: [Telegram Developer Chat](https://t.me/site15_community)