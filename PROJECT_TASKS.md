# Project Tasks Tracking

## Sprint 1 (2025-11-12 – 2025-11-17)

### 2025-11-12 (Day 1) - Infrastructure and Boilerplates
**Status**: ✅ COMPLETED

**Tasks**:
- [x] Initialize AnalogJS project and install tRPC and Pico.css (0.5h)
- [x] Initialize mobile application with Ionic + Capacitor (0.5h)
- [x] Set up NestJS + Prisma + PostgreSQL (0.5h)
  - [x] Import models from schema.prisma
  - [x] Generate Prisma Client
- [x] Configure dev/prod `.env` (0.25h)
- [x] Set up linters and code formatting (0.25h)

**Additional Tasks**:
- [x] Check database connection and create initial migrations

**Links**:
- [Prisma Docs](https://www.prisma.io/docs)
- [AnalogJS Docs](https://analogjs.org/docs)
- [Ionic Docs](https://ionicframework.com/docs)

---

### 2025-11-13 (Day 2) - Web Registration and Anonymous Mode
**Status**: ⚠️ PARTIALLY COMPLETED

**Tasks**:
- [x] Create Login, DashboardList, DashboardView pages (0.5h)
- [ ] Implement email/password registration and anonymous mode with localStorage saving (1h)
- [ ] Implement anonymous user reattachment during registration (0.25h)
- [ ] Connect basic validation and error handling (0.25h)

**Additional Tasks**:
- [ ] UX: "Continue as Guest" button
- [ ] SEO: basic meta tags for pages

**Links**:
- [LocalStorage MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

### 2025-11-14 (Day 3) - Dashboard and Widget CRUD + QR Code
**Status**: ⚠️ PARTIALLY COMPLETED

**Tasks**:
- [ ] tRPC routes for Dashboards: create/read/update/delete (0.5h)
- [ ] tRPC routes for Widgets: create/read/update/delete (0.5h)
- [x] Generate QR code for phone binding (`qrcode.react` or AnalogJS equivalent) (0.5h)
- [ ] Connect Dashboard → Widgets → Device via deviceId (0.25h)
- [x] Set up indexes and unique constraints via Prisma (0.25h)

**Retrospective**:
- [ ] Check anonymous mode, CRUD, QR code
- [ ] Fix UX and error logs

---

### 2025-11-15 (Day 4) - Mobile QR Code Scanning
**Status**: ❌ NOT STARTED

**Tasks**:
- [ ] Scan QR code screen via Ionic Barcode Scanner (0.5h)
- [ ] Save deviceId and bind to dashboard via tRPC (0.5h)
- [ ] Get widget list from server (0.5h)
- [ ] Cache widgets locally (0.25h)
- [ ] Log errors and successful binding (0.25h)

**Links**:
- [Ionic Barcode Scanner](https://ionicframework.com/docs/native/barcode-scanner)

---

### 2025-11-16 (Day 5) - Widget Display on Mobile
**Status**: ❌ NOT STARTED

**Tasks**:
- [ ] "Clock" component: `timeZone`, `name` (0.5h)
- [ ] "Calendar" component: fixed month and date (0.5h)
- [ ] Bind widget grid (columnIndex, rowIndex) from Widget model (0.5h)
- [ ] Connect auto-refresh via polling (0.5h)

**Additional Tasks**:
- [ ] UX: loading indicator, adaptation for different screens
- [ ] SEO: check web view via devtools

---

### 2025-11-17 (Day 6) - Web + Mobile Integration
**Status**: ❌ NOT STARTED

**Tasks**:
- [ ] Check all scenarios: registration, anonymous mode, phone binding, widget display (1h)
- [ ] Final web styling with Pico.css (0.5h)
- [ ] Prepare for local release (0.5h)

**Retrospective**:
- [ ] Check integration, QR UX, offline support

---

## Sprint 2 (2025-11-18 – 2025-11-24)

### 2025-11-18 (Day 7) - Widget Functionality Expansion
**Status**: ❌ NOT STARTED

**Tasks**:
- [ ] Connect color parameters: isBlackTheme, backgroundColor, primaryColor, positiveColor, negativeColor (0.5h)
- [ ] Save widget states in Widget.state (0.5h)
- [ ] Log changes in WidgetLog during update (1h)

---

### 2025-11-19 (Day 8) - Mobile Interface Improvement
**Status**: ❌ NOT STARTED

**Tasks**:
- [ ] Support different screen sizes and orientation (0.75h)
- [ ] Animations during widget updates (0.5h)
- [ ] Handle API errors and retry (0.5h)
- [ ] UX: pop-up notifications about updates (0.25h)

---

### 2025-11-20 (Day 9) - Retrospective and Bug Fixing
**Status**: ❌ NOT STARTED

**Tasks**:
- [ ] Check all web and mobile components (1h)
- [ ] Fix bugs and improve performance (1h)

---

### 2025-11-21 (Day 10) - Integration Testing
**Status**: ❌ NOT STARTED

**Tasks**:
- [ ] Anonymous mode, user reattachment, widget checking (1h)
- [ ] Prepare local release for testers (1h)

---

### 2025-11-22 (Day 11) - Metrics and Logs
**Status**: ❌ NOT STARTED

**Tasks**:
- [ ] Usage metrics: number of bound phones, dashboard views (1h)
- [ ] Log widget changes and user actions (1h)

---

### 2025-11-23 (Day 12) - Final Testing and Minor Improvements
**Status**: ❌ NOT STARTED

**Tasks**:
- [ ] Test web + mobile on different devices (1h)
- [ ] Fix minor bugs and UX improvements (1h)

---

### 2025-11-24 (Day 13) - Local MVP Release
**Status**: ❌ NOT STARTED

**Tasks**:
- [ ] Deploy web and mobile application on test devices (1h)
- [ ] Check all functions: registration, phone binding, widget display, anonymous reattachment (0.5h)
- [ ] Collect feedback and prepare documentation for next sprint (0.5h)

**Sprint Retrospective**:
- Results of 1.5 weeks, improvement plan and adding new widgets