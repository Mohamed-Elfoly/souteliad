# Tasks: Project Initialization & Structure

**Input**: Design documents from `/specs/001-project-init/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create project scaffolding, install dependencies, configure environment

- [x] T001 Create directory structure: `controllers/`, `models/`, `routes/`, `utils/`, `public/img/`, `dev-data/data/` at repository root
- [x] T002 Initialize `package.json` with project name `sout-elyad`, version `1.0.0`, entry point `server.js`, and all production dependencies: express ^4.18, mongoose ^7, dotenv ^16, helmet ^7, express-rate-limit ^7, express-mongo-sanitize ^2, xss-clean ^0.1, hpp ^0.2, cors ^2.8, morgan ^1.10, compression ^1.7, cookie-parser ^1.4, slugify ^1.3
- [x] T003 Add dev dependencies to `package.json`: nodemon ^3, eslint ^8, eslint-config-airbnb ^19, eslint-config-prettier ^9, eslint-plugin-node ^11, eslint-plugin-import ^2, prettier ^3
- [x] T004 [P] Create `.gitignore` with entries: `node_modules/`, `config.env`, `.env`, `*.log`, `.DS_Store`
- [x] T005 [P] Create `config.env` template at project root with variables: `NODE_ENV=development`, `PORT=3000`, `DATABASE=<connection-string>`, `DATABASE_PASSWORD=<password>`, `CORS_ORIGIN=http://localhost:3000`
- [x] T006 Run `npm install` to generate `package-lock.json` and install all dependencies

**Checkpoint**: Project scaffolding ready — all directories exist, all packages installed.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities that ALL user stories depend on — MUST complete before any story

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 [P] Create `utils/appError.js` — Custom AppError class extending Error with `statusCode`, `status` ('fail'|'error'), `isOperational` flag, and `Error.captureStackTrace`. Export the class.
- [x] T008 [P] Create `utils/catchAsync.js` — Higher-order function that accepts an async `fn` and returns `(req, res, next) => fn(req, res, next).catch(next)`. Export the function.
- [x] T009 [P] Create `utils/apiFeatures.js` — Class with constructor accepting `(query, queryString)` and methods: `filter()` (basic + advanced with gte/gt/lte/lt), `sort()` (default `-createdAt`), `limitFields()` (default exclude `__v`), `paginate()` (default page 1, limit 100). Export the class.

**Checkpoint**: Foundation ready — reusable utilities available for all stories.

---

## Phase 3: User Story 1 — System Health Verification (Priority: P1)

**Goal**: Server starts, connects to MongoDB Atlas, and responds to a
health-check request at `GET /api/v1/health`.

**Independent Test**: Start the application with `npm run dev`, then
send `GET http://localhost:3000/api/v1/health` and receive a
`{ status: "success", data: { status: "healthy", ... } }` response.

### Implementation for User Story 1

- [x] T010 [US1] Create `server.js` — Load `dotenv` from `./config.env`, connect to MongoDB Atlas using Mongoose (replace `<PASSWORD>` placeholder in connection string with `DATABASE_PASSWORD` env var), log `DB connection successful!`, start HTTP server on `PORT`, add process-level handlers for `uncaughtException` (log + exit), `unhandledRejection` (log + graceful server close), and `SIGTERM` (graceful shutdown)
- [x] T011 [US1] Create `app.js` — Initialize Express app, add `express.json({ limit: '10kb' })` body parser, `express.urlencoded({ extended: true, limit: '10kb' })`, `express.static('public')` for serving uploaded assets. Mount health route (T012). Export the app.
- [x] T012 [US1] Add health-check route in `app.js` — `GET /api/v1/health` responds with `{ status: 'success', data: { status: 'healthy', environment: process.env.NODE_ENV, timestamp: new Date().toISOString() } }` and status 200
- [x] T013 [US1] Verify: Start app with `node server.js`, confirm `DB connection successful!` log, send `GET /api/v1/health`, confirm 200 response with correct JSON envelope

**Checkpoint**: Server starts, DB connects, health-check responds. MVP baseline functional.

---

## Phase 4: User Story 2 — Security Baseline (Priority: P2)

**Goal**: All requests pass through security middleware: headers, rate
limiting, input sanitization, CORS, parameter pollution prevention,
response compression, and request logging.

**Independent Test**: Send a request to `/api/v1/health` and verify
response includes security headers (X-DNS-Prefetch-Control,
X-Content-Type-Options, etc.). Send 101+ requests in 15 minutes and
confirm rate-limit error on request 101. Send a request with `<script>`
in a field and confirm it is stripped.

### Implementation for User Story 2

- [x] T014 [US2] Add security headers middleware to `app.js` — Require `helmet` and add `app.use(helmet())` as the first middleware in the stack
- [x] T015 [US2] Add CORS configuration to `app.js` — Require `cors`, configure with `origin: process.env.CORS_ORIGIN`, add `app.use(cors())` and `app.options('*', cors())` for preflight
- [x] T016 [US2] Add rate limiting to `app.js` — Require `express-rate-limit`, create limiter with `max: 100`, `windowMs: 15 * 60 * 1000`, `message: 'Too many requests from this IP, please try again later'`, apply to `/api` routes
- [x] T017 [US2] Add data sanitization middleware to `app.js` — Require and add `express-mongo-sanitize()` (NoSQL injection), `xss-clean` via `xss()` (XSS), `hpp()` (parameter pollution) in that order after body parsers
- [x] T018 [US2] Add request logging to `app.js` — Require `morgan`, add `app.use(morgan('dev'))` conditionally when `NODE_ENV === 'development'`
- [x] T019 [US2] Add cookie parsing and compression to `app.js` — Require `cookie-parser` and `compression`, add `app.use(cookieParser())` and `app.use(compression())`
- [x] T020 [US2] Verify: Send request to `/api/v1/health`, inspect response headers for helmet headers, test CORS with wrong origin gets rejected, confirm morgan logs in console

**Checkpoint**: Full security middleware stack active. All requests sanitized and rate-limited.

---

## Phase 5: User Story 3 — Error Handling Foundation (Priority: P3)

**Goal**: Centralized error handler catches all errors and returns
consistent JSON responses. Development mode shows full details;
production mode hides internals.

**Independent Test**: Send `GET /api/v1/nonexistent` and confirm
structured 404 response. Set `NODE_ENV=production` and confirm no
stack traces leak.

### Implementation for User Story 3

- [x] T021 [US3] Create `controllers/errorController.js` — Implement: `handleCastErrorDB` (invalid MongoDB ObjectId), `handleDuplicateFieldsDB` (E11000), `handleValidationErrorDB` (Mongoose validation), `handleJWTError` (invalid token), `handleJWTExpiredError` (expired token). Implement `sendErrorDev(err, req, res)` with full details + stack. Implement `sendErrorProd(err, req, res)` with only user-friendly message for operational errors and generic message for programming errors. Export the global error handler middleware.
- [x] T022 [US3] Add catch-all 404 route in `app.js` — After all route mounts, add `app.all('*', (req, res, next) => next(new AppError('Can\'t find ${req.originalUrl} on this server!', 404)))` using `utils/appError.js`
- [x] T023 [US3] Wire global error middleware in `app.js` — Import `errorController` and add `app.use(globalErrorHandler)` as the LAST middleware (after 404 catch-all)
- [x] T024 [US3] Verify: Request `/api/v1/nonexistent` returns `{ status: 'fail', message: "Can't find /api/v1/nonexistent on this server!" }` with 404 status. In dev mode, confirm stack trace present. In prod mode, confirm no stack trace.

**Checkpoint**: All errors return consistent JSON. No unhandled errors crash the server.

---

## Phase 6: User Story 4 — Developer Onboarding Readiness (Priority: P4)

**Goal**: Developer can clone, install, configure, and start the
application in under 5 minutes. Linting passes with zero errors.

**Independent Test**: From a fresh clone, run `npm install`, create
`config.env`, run `npm run dev`, confirm server starts. Run
`npm run lint` and confirm zero errors.

### Implementation for User Story 4

- [x] T025 [P] [US4] Create `.eslintrc.json` at project root — Extend `airbnb`, `prettier`, plugin `node`. Rules: `no-console` warn, `no-unused-vars` warn (ignore `req`, `res`, `next`, `val`), `no-process-exit` off, allow `no-param-reassign` for `props`. Env: `node: true`, parserOptions: `ecmaVersion: 2020`
- [x] T026 [P] [US4] Create `.prettierrc` at project root — Set `singleQuote: true`, `tabWidth: 2`, `trailingComma: "es5"`
- [x] T027 [US4] Add npm scripts to `package.json` — `"start": "node server.js"`, `"dev": "nodemon server.js"`, `"start:prod": "SET NODE_ENV=production && nodemon server.js"`, `"lint": "eslint ."`, `"lint:fix": "eslint . --fix"`
- [x] T028 [US4] Run `npm run lint` on all project files and fix any reported errors until lint passes with zero errors
- [x] T029 [US4] Verify: Full onboarding flow — `npm install` → create `config.env` → `npm run dev` → server starts → `GET /api/v1/health` → 200 OK → `npm run lint` → zero errors

**Checkpoint**: Developer experience complete. Any team member can onboard in under 5 minutes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final foundational pieces that support future features

- [x] T030 [P] Create `controllers/handlerFactory.js` — Export factory functions: `getAll(Model)`, `getOne(Model, popOptions)`, `createOne(Model)`, `updateOne(Model)`, `deleteOne(Model)`. Each returns `catchAsync`-wrapped handler with standard response envelope. `getAll` integrates `APIFeatures`. `getOne` returns 404 via `AppError` if no doc found. `updateOne` uses `{ runValidators: true }`. `deleteOne` returns 204 with null data.
- [x] T031 [P] Create `dev-data/data/` placeholder with empty `.gitkeep` file to preserve directory in git
- [x] T032 Validate complete middleware order in `app.js` is correct: (1) helmet, (2) cors, (3) static files, (4) morgan, (5) rate limiter, (6) body parsers + cookie parser, (7) data sanitization (mongo-sanitize, xss, hpp), (8) compression, (9) route mounts, (10) 404 catch-all, (11) global error handler
- [x] T033 Run quickstart.md validation — Follow every step in `specs/001-project-init/quickstart.md` from scratch and confirm each works as documented

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (npm install complete)
- **US1 (Phase 3)**: Depends on Phase 2 (appError, catchAsync available)
- **US2 (Phase 4)**: Depends on Phase 3 (app.js exists to add middleware to)
- **US3 (Phase 5)**: Depends on Phase 3 (app.js exists) + Phase 2 (appError available)
- **US4 (Phase 6)**: Depends on Phase 3 (source files exist to lint)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **US1 (P1)**: Foundation only → Creates `server.js` and `app.js`
- **US2 (P2)**: Depends on US1 → Adds middleware to `app.js`
- **US3 (P3)**: Depends on US1 → Adds error handling to `app.js`. Can run in parallel with US2 if middleware order is coordinated.
- **US4 (P4)**: Depends on US1 → Lints existing files. Can run in parallel with US2/US3.

### Within Each User Story

- Implementation tasks are sequential (same file: `app.js`)
- Verification task always last in each phase

### Parallel Opportunities

- **Phase 1**: T004 (.gitignore) and T005 (config.env) are parallel
- **Phase 2**: T007 (appError), T008 (catchAsync), T009 (apiFeatures) are all parallel — different files
- **Phase 6**: T025 (.eslintrc.json) and T026 (.prettierrc) are parallel — different files
- **Phase 7**: T030 (handlerFactory) and T031 (dev-data) are parallel — different files
- **US3 and US4**: Can start in parallel after US1 is complete (US3 touches `app.js` error handling, US4 touches `.eslintrc.json` — different files)

---

## Parallel Example: Phase 2 (Foundational)

```bash
# All three utility files can be created simultaneously:
Task T007: "Create utils/appError.js"
Task T008: "Create utils/catchAsync.js"
Task T009: "Create utils/apiFeatures.js"
```

## Parallel Example: Phase 6 (US4)

```bash
# Config files are independent:
Task T025: "Create .eslintrc.json"
Task T026: "Create .prettierrc"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T006)
2. Complete Phase 2: Foundational (T007–T009)
3. Complete Phase 3: US1 (T010–T013)
4. **STOP and VALIDATE**: `npm run dev` → `GET /api/v1/health` → 200 OK
5. Server is running and responding — minimal viable backend

### Incremental Delivery

1. Setup + Foundational → Scaffolding ready
2. Add US1 → Server starts, DB connects, health endpoint (MVP!)
3. Add US2 → Security middleware active on all requests
4. Add US3 → Error handling standardized across the app
5. Add US4 → Linting clean, developer tooling ready
6. Polish → Handler factory ready for future features

### Recommended Execution Order (Solo Developer)

Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) →
Phase 5 (US3) → Phase 6 (US4) → Phase 7 (Polish)

Total estimated tasks: 33

---

## Notes

- All tasks target the repository root — no `src/` prefix (Natours convention)
- `app.js` is the most-touched file (US1 creates it, US2–US3 extend it)
- Tasks within a user story are sequential when touching the same file
- No automated tests in this feature — manual Postman/curl verification
- Each verification task (T013, T020, T024, T029, T033) is a manual check
