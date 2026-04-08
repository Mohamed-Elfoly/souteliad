# Research: Core Backend — Models, Auth, Routes & Seeding

**Feature**: 002-core-backend
**Date**: 2026-02-07

## R-001: JWT Authentication Strategy

**Decision**: Use jsonwebtoken for token creation/verification, bcryptjs
for password hashing (cost 12), and deliver tokens via HttpOnly cookies
+ response body (dual delivery).

**Rationale**: Matches Natours reference project exactly. HttpOnly
cookies prevent XSS token theft; response body supports mobile clients.
Constitution Principle II mandates this approach.

**Alternatives considered**:
- Passport.js: Adds abstraction layer not used in Natours. Rejected.
- express-session: Session-based auth doesn't fit stateless REST API. Rejected.
- OAuth2/Social login: Out of scope for initial build. Can be added later.

## R-002: User Model — Single Model for All Roles

**Decision**: Use a single `User` model with a `role` enum field
(`user`, `teacher`, `admin`) rather than separate models per role.

**Rationale**: The ERD shows User, Teacher, and Admin as separate
entities but they share identical fields (firstName, lastName, email,
password, phoneNum, profilePicture). A single model with a role
discriminator is simpler, matches Natours, and avoids join complexity.

**Alternatives considered**:
- Separate User/Teacher/Admin models: More tables, duplicate schemas,
  complex auth queries. Rejected.
- Mongoose discriminators: Adds unnecessary complexity when the schemas
  are identical. Rejected.

## R-003: Quiz Question Model Design

**Decision**: Questions are stored as separate documents in a
`Question` collection (not embedded in Quiz). Each question has
`questionText`, `questionType` (enum: MCQ, true-false, matching),
`marks`, `options` (array of objects with `text` and `isCorrect`),
and a reference to `quizId`.

**Rationale**: Separate collection allows independent CRUD on questions,
virtual populate from Quiz to Questions, and flexible question types.
The ERD shows Question as a separate entity with its own fields.

**Alternatives considered**:
- Embed questions as subdocuments in Quiz: Limits individual question
  operations and makes large quizzes unwieldy. Rejected.
- Store options as a separate collection: Over-normalized for this use
  case. Options are always fetched with their question. Rejected.

## R-004: Like Toggle Pattern

**Decision**: Use a compound unique index on `{ post, user }` in the
Like model. The toggle endpoint checks for an existing like — if found,
deletes it; if not, creates it. A single POST endpoint handles both.

**Rationale**: Prevents duplicate likes per user per post at the
database level. Toggle pattern is standard for social interactions
and avoids needing separate like/unlike endpoints.

**Alternatives considered**:
- Increment/decrement counter on Post: Loses individual like records
  needed for "who liked" queries. Rejected.
- Separate like/unlike endpoints: More API surface for the same
  behavior. Rejected.

## R-005: Password Reset — Console Logging (Stubbed Email)

**Decision**: Implement the full password reset flow (generate token,
hash and store it, validate on submission) but log the reset URL to
console instead of sending an actual email. Email transport will be
added in a future feature.

**Rationale**: The spec explicitly states email sending is out of scope.
The reset token logic is worth implementing now so the auth flow is
complete and testable. Constitution requires Nodemailer with
environment-based transport — this will be honored when the email
feature is implemented.

**Alternatives considered**:
- Skip password reset entirely: Leaves auth incomplete. Rejected.
- Implement full email with Mailtrap: Adds dependency and config
  complexity not needed for this feature's scope. Deferred.

## R-006: Seeding Script Pattern

**Decision**: Follow Natours `import-dev-data.js` pattern with
`--import` and `--delete` CLI flags. Script connects to DB, reads JSON
files from `dev-data/data/`, and either imports all data or deletes all
data based on the flag.

**Rationale**: Direct match to Natours convention and constitution's
Development Workflow section. Simple CLI-based approach that works
with local and Atlas databases.

**Alternatives considered**:
- Mongoose fixtures library: External dependency for a simple script.
  Rejected.
- Seed on server start: Pollutes the server startup logic. Rejected.

## R-007: New Dependencies Required

**Decision**: Install these additional production dependencies:
- `jsonwebtoken` ^9 — JWT signing and verification
- `bcryptjs` ^2.4 — Password hashing
- `validator` ^13 — Email/URL validation in schemas

**Rationale**: These are the exact packages used in Natours. All are
well-maintained, widely used, and serve clear immediate needs per the
constitution's dependency principle.

**Alternatives considered**:
- `bcrypt` (native): Requires native build tools, harder to install on
  Windows. `bcryptjs` is pure JS and compatible. Used in Natours.
- `joi` for validation: Mongoose built-in validation + `validator`
  library is sufficient. No need for a schema validation layer.

## R-008: Nested Route Strategy

**Decision**: Use Express `mergeParams: true` for child resources:
- `/api/v1/levels/:levelId/lessons` → lessons nested under levels
- `/api/v1/lessons/:lessonId/quizzes` → quizzes nested under lessons
- `/api/v1/quizzes/:quizId/questions` → questions nested under quizzes
- `/api/v1/posts/:postId/comments` → comments nested under posts
- `/api/v1/posts/:postId/likes` → likes nested under posts
- `/api/v1/posts/:postId/reports` → reports nested under posts

Each child router also supports top-level access (e.g., `GET /api/v1/lessons`
returns all lessons).

**Rationale**: Constitution Principle IV mandates nested routes with
`mergeParams: true`. This pattern allows both nested and standalone
access while keeping route files independent.

**Alternatives considered**:
- Query parameter filtering only (e.g., `?levelId=xxx`): Less RESTful.
  Rejected.
- Deeply nested routes (3+ levels): Over-complex. Keep to 2 levels max.

## R-009: Quiz Attempt Scoring

**Decision**: When a learner submits quiz answers, the server calculates
the score by comparing each submitted `selectedOptionId` against the
question's correct option. The score is the sum of marks for correctly
answered questions. A `passed` boolean is set to `true` if the score
meets or exceeds 60% of total possible marks.

**Rationale**: Server-side scoring prevents cheating. The 60% pass
threshold is a reasonable default and can be made configurable later.

**Alternatives considered**:
- Client-side scoring: Easily manipulated. Rejected.
- Configurable pass percentage per quiz: Over-engineering for initial
  build. Can be added later with a `passPercentage` field on Quiz.
