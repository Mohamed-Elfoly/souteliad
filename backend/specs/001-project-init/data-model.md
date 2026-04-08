# Data Model: Project Initialization & Structure

**Feature**: 001-project-init
**Date**: 2026-02-07

## Overview

This feature does not introduce business-domain models (User, Lesson,
Quiz, etc.). Those are deferred to their respective feature specs.

This document defines the foundational data patterns and utility
structures that all future models will depend on.

## Foundational Utilities (not models)

### AppError

Custom error class used throughout the application. Not a database
entity — a runtime JavaScript class.

| Property | Type | Description |
|----------|------|-------------|
| message | String | Human-readable error description |
| statusCode | Number | HTTP status code (400, 401, 403, 404, 500) |
| status | String | `'fail'` for 4xx, `'error'` for 5xx |
| isOperational | Boolean | `true` for expected errors; `false` for programming bugs |

### APIFeatures

Query-processing utility. Operates on any Mongoose query object.

| Method | Input | Output |
|--------|-------|--------|
| filter() | Query string params (excluding page, sort, limit, fields) | Filtered Mongoose query with `$gte`, `$gt`, `$lte`, `$lt` operators |
| sort() | `?sort=field1,-field2` | Sorted query (default: `-createdAt`) |
| limitFields() | `?fields=field1,field2` | Projected query (default: exclude `__v`) |
| paginate() | `?page=N&limit=M` | Paginated query (default: page 1, limit 100) |

## Environment Variables Schema

The `config.env` file defines all runtime configuration. These are
the variables required for this feature:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NODE_ENV | Yes | development | `development` or `production` |
| PORT | Yes | 3000 | Server port |
| DATABASE | Yes | — | MongoDB Atlas connection string with `<PASSWORD>` placeholder |
| DATABASE_PASSWORD | Yes | — | MongoDB Atlas password (replaces `<PASSWORD>` in DATABASE) |
| CORS_ORIGIN | Yes | http://localhost:3000 | Allowed frontend origin for CORS |

Additional variables (JWT_SECRET, EMAIL_*, etc.) will be added by
their respective features.

## Future Entity Placeholder

The constitution defines 8 core entities. They will be implemented in
these planned features:

| Entity | Planned Feature |
|--------|----------------|
| User | Authentication & User Management |
| Lesson | Lesson Management |
| Quiz | Quiz Management |
| Progress | Progress Tracking |
| ChatSession | AI Chat |
| Post | Community |
| Notification | Notification System |
| Feedback | Feedback System |
