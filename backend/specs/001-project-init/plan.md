# Implementation Plan: Project Initialization & Structure

**Branch**: `001-project-init` | **Date**: 2026-02-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-project-init/spec.md`

## Summary

Initialize the Sout-Elyad backend as a Node.js + Express + MongoDB
Atlas REST API. This creates the complete project scaffolding: directory
structure, core server setup, global middleware stack (security, parsing,
compression, CORS), centralized error handling (AppError, catchAsync,
global error handler), reusable utilities (APIFeatures), environment
configuration, ESLint + Prettier, and a health-check endpoint. All
conventions follow the Natours reference project as defined in the
project constitution v1.1.0.

## Technical Context

**Language/Version**: Node.js LTS (v20.x) with CommonJS modules
**Primary Dependencies**:
  - express ^4.18 — Web framework
  - mongoose ^7.x — MongoDB ODM
  - dotenv ^16.x — Environment variables
  - helmet ^7.x — Security headers
  - express-rate-limit ^7.x — Rate limiting
  - express-mongo-sanitize ^2.x — NoSQL injection prevention
  - xss-clean ^0.1.x — XSS prevention
  - hpp ^0.2.x — HTTP parameter pollution prevention
  - cors ^2.8.x — Cross-origin requests
  - morgan ^1.10.x — HTTP request logging
  - compression ^1.7.x — Response compression
  - cookie-parser ^1.4.x — Cookie parsing

**Dev Dependencies**:
  - nodemon ^3.x — Auto-restart on file changes
  - eslint ^8.x — Code linting (airbnb config)
  - eslint-config-airbnb ^19.x
  - eslint-config-prettier ^9.x
  - eslint-plugin-node ^11.x
  - eslint-plugin-import ^2.x
  - prettier ^3.x — Code formatting

**Storage**: MongoDB Atlas (cloud-hosted)
**Testing**: Postman (manual endpoint testing); no automated test
  framework in this feature — deferred to a later feature.
**Target Platform**: Backend REST API server (Node.js on any OS)
**Project Type**: Single backend application
**Performance Goals**: Health-check responds within 5 seconds of launch;
  rate-limited responses within 100ms.
**Constraints**: No frontend code; no views/templates; no AI inference.
**Scale/Scope**: Foundation for ~8 entity models and ~50 endpoints
  across future features.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | Natours-Aligned API Architecture | ✅ PASS | Directory structure follows `controllers/`, `models/`, `routes/`, `utils/`, `app.js`, `server.js`, `public/` exactly. No views. |
| II | Security-First Design | ✅ PASS | All 6 security packages in dependency list. CORS configured via `CORS_ORIGIN` env var. Secrets in `config.env` (git-ignored). |
| III | Error Handling Discipline | ✅ PASS | AppError class, catchAsync wrapper, and errorController.js with dev/prod distinction all in scope. Process-level handlers included. |
| IV | RESTful API Consistency | ✅ PASS | `/api/v1/` base path. Standard response envelope. APIFeatures utility created. |
| V | Role-Based Access Control | ⬜ N/A | No auth endpoints in this feature. RBAC will be added in auth feature. |
| VI | Mongoose Schema Rigor | ⬜ N/A | No business models in this feature. Schema conventions will apply starting with auth feature. |
| VII | Handler Factory Pattern | ✅ PASS | `handlerFactory.js` created with `getAll`, `getOne`, `createOne`, `updateOne`, `deleteOne` exports. |
| VIII | AI Service Boundary | ⬜ N/A | No AI endpoints in this feature. Backend stores data only — enforced from AI feature onward. |

**Gate result**: ✅ PASS — All applicable principles satisfied. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-init/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── health-check.md  # Health-check endpoint contract
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
sout-elyad/
├── app.js                    # Express app setup, middleware, route mounting
├── server.js                 # Server init, DB connection, process handlers
├── config.env                # Environment variables (git-ignored)
├── package.json              # Dependencies and scripts
├── .eslintrc.json            # ESLint config (airbnb + prettier + node)
├── .prettierrc               # Prettier config
├── .gitignore                # Git ignore rules
│
├── controllers/              # Business logic handlers
│   ├── errorController.js    # Global error handler (dev/prod)
│   └── handlerFactory.js     # Reusable CRUD factory
│
├── models/                   # Mongoose schemas (empty for now)
│
├── routes/                   # Express route definitions
│
├── utils/                    # Shared utilities
│   ├── appError.js           # Custom AppError class
│   ├── catchAsync.js         # Async error wrapper
│   └── apiFeatures.js        # Query filtering/sorting/pagination
│
├── public/                   # Uploaded assets (images, media)
│   └── img/                  # Image uploads directory
│
└── dev-data/                 # Development seed data
    └── data/                 # JSON seed files (populated later)
```

**Structure Decision**: Single backend project following the Natours
reference exactly. No monorepo, no frontend, no service layers. The
`controllers/`, `models/`, `routes/`, `utils/` layout matches
Constitution Principle I.

## Complexity Tracking

> No violations detected. Table intentionally empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| — | — | — |
