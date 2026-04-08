# Quickstart: Core Backend — Models, Auth, Routes & Seeding

## Prerequisites

- Completed 001-project-init (server starts, health check works)
- MongoDB running locally or Atlas connection configured
- Node.js 20.x LTS

## Setup

1. **Install new dependencies**

   ```bash
   npm install jsonwebtoken bcryptjs validator
   ```

2. **Update config.env**

   Add these variables to your existing `config.env`:

   ```env
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90
   ```

3. **Seed the database**

   ```bash
   node dev-data/import-dev-data.js --delete
   node dev-data/import-dev-data.js --import
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

## Verify Authentication

1. **Register a new user**

   ```bash
   curl -X POST http://localhost:3000/api/v1/users/signup \
     -H "Content-Type: application/json" \
     -d '{"firstName":"Test","lastName":"User","email":"test@test.com","password":"password123","passwordConfirm":"password123"}'
   ```

   Expected: 201 with token and user data.

2. **Login**

   ```bash
   curl -X POST http://localhost:3000/api/v1/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"password123"}'
   ```

   Expected: 200 with token.

3. **Access protected route**

   ```bash
   curl http://localhost:3000/api/v1/users/me \
     -H "Authorization: Bearer <token-from-login>"
   ```

   Expected: 200 with user profile.

## Verify CRUD Operations

4. **Get all levels**

   ```bash
   curl http://localhost:3000/api/v1/levels \
     -H "Authorization: Bearer <token>"
   ```

5. **Get lessons for a level**

   ```bash
   curl http://localhost:3000/api/v1/levels/<levelId>/lessons \
     -H "Authorization: Bearer <token>"
   ```

6. **Create a community post**

   ```bash
   curl -X POST http://localhost:3000/api/v1/posts \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"content":"Hello community!"}'
   ```

## Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sout-elyad.com | password123 |
| Teacher | teacher@sout-elyad.com | password123 |
| Learner | user@sout-elyad.com | password123 |

## API Base URL

All endpoints are under `http://localhost:3000/api/v1/`

| Resource | Base Path |
|----------|-----------|
| Auth | `/api/v1/users/signup`, `login`, `logout`, `forgotPassword`, `resetPassword` |
| Users | `/api/v1/users` |
| Levels | `/api/v1/levels` |
| Lessons | `/api/v1/lessons` (also nested: `/levels/:id/lessons`) |
| Quizzes | `/api/v1/quizzes` (also nested: `/lessons/:id/quizzes`) |
| Questions | `/api/v1/questions` (also nested: `/quizzes/:id/questions`) |
| Quiz Attempts | `/api/v1/quiz-attempts` |
| Progress | `/api/v1/progress` |
| Posts | `/api/v1/posts` |
| Comments | `/api/v1/comments` (also nested: `/posts/:id/comments`) |
| Likes | (nested only: `/posts/:id/likes`) |
| Reports | `/api/v1/reports` (also nested: `/posts/:id/reports`) |
| Notifications | `/api/v1/notifications` |
