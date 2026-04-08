# Implementation Plan: Core Backend — Models, Auth, Routes & Seeding

**Branch**: `002-core-backend` | **Date**: 2026-02-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/002-core-backend/spec.md`

## Summary

Implement all Mongoose models, JWT authentication with role-based access
control, CRUD controllers and Express routes for every entity in the ERD
(User, Level, Lesson, Quiz, Question, QuizAttempt, UserAnswer,
LessonProgress, Post, Comment, Like, Report, Notification), plus a
database seeding script. Builds on top of the project scaffold from
001-project-init (app.js, server.js, middleware stack, error handling,
handler factory).

## Technical Context

**Language/Version**: Node.js 20.x LTS with CommonJS modules
**Primary Dependencies**:
- express ^4.18, mongoose ^7 (already installed)
- jsonwebtoken ^9 (JWT token creation/verification)
- bcryptjs ^2.4 (password hashing, cost 12)
- validator ^13 (email validation in Mongoose schemas)
- crypto (built-in, for password reset tokens)
**Storage**: MongoDB (local dev: `mongodb://localhost:27017/sout-elyad`, production: MongoDB Atlas)
**Testing**: Manual via Postman/curl (no automated test framework for this feature)
**Target Platform**: Node.js server (Linux/Windows)
**Project Type**: Single backend API (frontend in separate React repo)
**Performance Goals**: Standard web API (<500ms response for all endpoints)
**Constraints**: Follow Natours conventions exactly per constitution
**Scale/Scope**: 13 Mongoose models, ~10 route files, ~10 controller files, 1 auth controller, 1 seeding script

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Applicable | Status | Notes |
|-----------|-----------|--------|-------|
| I. Natours-Aligned API Architecture | Yes | PASS | All files follow controllers/, models/, routes/ pattern. One file per resource. |
| II. Security-First Design | Yes | PASS | JWT + bcryptjs + HttpOnly cookies. All existing middleware from 001. |
| III. Error Handling Discipline | Yes | PASS | AppError, catchAsync, globalErrorHandler already in place from 001. |
| IV. RESTful API Consistency | Yes | PASS | /api/v1/ base path. Standard response envelope. APIFeatures class available. |
| V. Role-Based Access Control | Yes | PASS | Three roles (user, teacher, admin). restrictTo() middleware planned. |
| VI. Mongoose Schema Rigor | Yes | PASS | All schemas will have required messages, trim, enums, indexes, virtuals. |
| VII. Handler Factory Pattern | Yes | PASS | handlerFactory.js already exists from 001. Controllers will use it. |
| VIII. AI Service Boundary | N/A | PASS | ChatSession/AI features deferred to future feature. Backend stores data only. |

All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/002-core-backend/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── auth.md
│   ├── users.md
│   ├── levels.md
│   ├── lessons.md
│   ├── quizzes.md
│   ├── progress.md
│   ├── posts.md
│   ├── notifications.md
│   └── seeding.md
└── tasks.md
```

### Source Code (repository root)

```text
sout-elyad/
├── app.js                        # Route mounting (updated)
├── server.js                     # (unchanged from 001)
├── config.env                    # Add JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN
├── controllers/
│   ├── errorController.js        # (unchanged from 001)
│   ├── handlerFactory.js         # (unchanged from 001)
│   ├── authController.js         # signup, login, logout, protect, restrictTo, forgotPassword, resetPassword, updatePassword
│   ├── userController.js         # getMe, updateMe, deleteMe, getAllUsers, getUser, updateUser, deleteUser
│   ├── levelController.js        # CRUD via factory
│   ├── lessonController.js       # CRUD via factory + nested route support
│   ├── quizController.js         # CRUD via factory + nested route support
│   ├── questionController.js     # CRUD via factory + nested under quizzes
│   ├── quizAttemptController.js  # submitQuiz (custom), getMyAttempts, getAttempt
│   ├── lessonProgressController.js # markComplete, getMyProgress, getUserProgress
│   ├── postController.js         # CRUD via factory
│   ├── commentController.js      # CRUD via factory + nested under posts
│   ├── likeController.js         # toggleLike, getLikes
│   ├── reportController.js       # createReport, getReports, updateReportStatus
│   └── notificationController.js # getMyNotifications, markAsRead, getUnreadCount
├── models/
│   ├── userModel.js
│   ├── levelModel.js
│   ├── lessonModel.js
│   ├── quizModel.js
│   ├── questionModel.js
│   ├── quizAttemptModel.js
│   ├── userAnswerModel.js
│   ├── lessonProgressModel.js
│   ├── postModel.js
│   ├── commentModel.js
│   ├── likeModel.js
│   ├── reportModel.js
│   └── notificationModel.js
├── routes/
│   ├── userRoutes.js
│   ├── levelRoutes.js
│   ├── lessonRoutes.js
│   ├── quizRoutes.js
│   ├── questionRoutes.js
│   ├── quizAttemptRoutes.js
│   ├── lessonProgressRoutes.js
│   ├── postRoutes.js
│   ├── commentRoutes.js
│   ├── likeRoutes.js
│   ├── reportRoutes.js
│   └── notificationRoutes.js
├── utils/
│   ├── appError.js               # (unchanged from 001)
│   ├── catchAsync.js             # (unchanged from 001)
│   └── apiFeatures.js            # (unchanged from 001)
├── dev-data/
│   ├── data/
│   │   ├── users.json
│   │   ├── levels.json
│   │   ├── lessons.json
│   │   ├── quizzes.json
│   │   ├── questions.json
│   │   └── posts.json
│   └── import-dev-data.js
└── public/img/                   # (unchanged from 001)
```

**Structure Decision**: Single backend project at repository root, following
Natours convention. No src/ prefix. All source files at root level in
controllers/, models/, routes/, utils/. Frontend is in a separate React repo.
