# Research: Project Initialization & Structure

**Feature**: 001-project-init
**Date**: 2026-02-07

## Overview

No critical unknowns existed for this feature. All technology choices
are prescribed by the project constitution v1.1.0 and the Natours
reference project. This document records the rationale for version
selections and configuration choices.

## Decisions

### R-001: Node.js Version

**Decision**: Node.js 20.x LTS
**Rationale**: Current LTS release with long-term support through
April 2026. Stable ES2023 features. Compatible with all selected
dependencies.
**Alternatives considered**:
- Node.js 22.x — Too new, some packages may not yet support it.
- Node.js 18.x — Entering maintenance mode, shorter support window.

### R-002: Module System

**Decision**: CommonJS (`require`/`module.exports`)
**Rationale**: The Natours reference project uses CommonJS throughout.
Switching to ES Modules would deviate from the reference conventions
and require `"type": "module"` in package.json plus renaming patterns.
**Alternatives considered**:
- ES Modules (`import`/`export`) — Cleaner syntax but breaks
  convention alignment with Natours reference.

### R-003: Mongoose Version

**Decision**: Mongoose 7.x (latest stable)
**Rationale**: Mongoose 7 drops deprecated options
(`useNewUrlParser`, `useCreateIndex`, `useFindAndModify`) that Natours
had to set explicitly. Cleaner connection setup. Full MongoDB 6/7
support.
**Alternatives considered**:
- Mongoose 5.x (Natours version) — Outdated, requires deprecated
  connection flags, no MongoDB 7 support.
- Mongoose 8.x — Available but 7.x is more battle-tested.

### R-004: ESLint Configuration

**Decision**: ESLint 8.x with airbnb + prettier + node plugins
**Rationale**: Matches Natours `.eslintrc.json` configuration exactly.
ESLint 9.x uses flat config format which would deviate from reference.
**Alternatives considered**:
- ESLint 9.x with flat config — Different config format, harder
  to maintain consistency with Natours patterns.

### R-005: Rate Limiting Strategy

**Decision**: 100 requests per 15 minutes per IP on `/api` routes.
Stricter limits on auth endpoints (to be configured in auth feature).
**Rationale**: Standard protection against brute-force and DoS without
impacting normal usage. Natours uses 100 per hour which is more
restrictive; 100 per 15 minutes is a reasonable starting point for
a learning platform with frequent API calls.
**Alternatives considered**:
- 100 per hour (Natours default) — Too restrictive for a learning
  app where users make many rapid requests (quizzes, progress).
- No global limit, per-route only — Leaves unprotected endpoints
  exposed.

### R-006: CORS Configuration

**Decision**: Use `CORS_ORIGIN` environment variable. In development,
set to `http://localhost:3000` (React default). In production, set
to the deployed frontend domain.
**Rationale**: Constitution Principle II mandates CORS via env var.
Allows flexible configuration per environment without code changes.
**Alternatives considered**:
- Wildcard (`*`) — Insecure, violates constitution.
- Hardcoded origins — Not flexible across environments.

### R-007: Environment File Naming

**Decision**: `config.env` at project root (git-ignored)
**Rationale**: Matches Natours convention exactly. `dotenv` loads
from this path in `server.js`.
**Alternatives considered**:
- `.env` — More conventional but deviates from Natours reference.
- `.env.development` / `.env.production` — Over-engineered for
  current needs; `NODE_ENV` flag in a single file is sufficient.

### R-008: Health-Check Endpoint Path

**Decision**: `GET /api/v1/health`
**Rationale**: Under the `/api/v1/` prefix per Constitution Principle
IV. Simple, discoverable, and follows REST conventions.
**Alternatives considered**:
- `GET /health` — Outside API prefix, breaks constitution rule.
- `GET /api/v1/status` — Equally valid but "health" is more standard
  for infrastructure monitoring.
