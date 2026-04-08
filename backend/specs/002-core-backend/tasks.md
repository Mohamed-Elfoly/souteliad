# Tasks: Core Backend — Models, Auth, Routes & Seeding

**Input**: Design documents from `/specs/002-core-backend/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested — no test tasks generated.

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install new dependencies, update environment config

- [x] T001 Install new production dependencies: `npm install jsonwebtoken bcryptjs validator`
- [x] T002 Update `config.env` to add `JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars`, `JWT_EXPIRES_IN=90d`, `JWT_COOKIE_EXPIRES_IN=90`

**Checkpoint**: New packages installed, environment configured for JWT auth.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: User model and auth controller — MUST complete before ANY user story can proceed. Every route depends on `protect` and `restrictTo` middleware.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T003 Create `models/userModel.js` — Schema with fields: firstName (String, required, trim), lastName (String, required, trim), email (String, required, unique, lowercase, validated with `validator.isEmail`), password (String, required, minlength 8, select: false), passwordConfirm (String, required, custom validator matches password), passwordChangedAt (Date), passwordResetToken (String), passwordResetExpires (Date), role (String, enum: [user, teacher, admin], default: user), phoneNum (String, trim), profilePicture (String, default: 'default.jpg'), active (Boolean, default: true, select: false), createdAt (Date, default: Date.now). Add pre-save hook to hash password with bcryptjs (cost 12), pre-save hook to set passwordChangedAt, pre-find query middleware to filter `{ active: { $ne: false } }`. Add instance methods: `correctPassword(candidatePassword, userPassword)` using bcrypt.compare, `changedPasswordAfter(JWTTimestamp)`, `createPasswordResetToken()` using crypto. Export the model.
- [x] T004 Create `controllers/authController.js` — Implement: (1) `signToken(id)` helper using jwt.sign with JWT_SECRET and JWT_EXPIRES_IN, (2) `createSendToken(user, statusCode, req, res)` helper that creates token, sets HttpOnly cookie, removes password from output, sends response. (3) `signup` — create user from req.body (whitelist: firstName, lastName, email, password, passwordConfirm, phoneNum), call createSendToken with 201. (4) `login` — validate email+password present, find user with `+password`, verify with correctPassword, call createSendToken. (5) `logout` — set jwt cookie to 'loggedout' with 10ms expiry. (6) `protect` middleware — extract token from Authorization header or cookies, verify with jwt.verify, check user still exists, check changedPasswordAfter, set req.user. (7) `restrictTo(...roles)` — return middleware that checks req.user.role in roles array, 403 if not. (8) `forgotPassword` — find user by email, generate reset token via createPasswordResetToken, save user, log reset URL to console (email transport stubbed). (9) `resetPassword` — hash token param, find user by hashed token and unexpired, set new password, clear reset fields, call createSendToken. (10) `updatePassword` — find user with +password, verify current password, set new password, call createSendToken. Export all.
- [x] T005 Create `controllers/userController.js` — Implement: `getMe` middleware (sets req.params.id = req.user.id, calls next), `updateMe` (filter body to allowed fields: firstName, lastName, email, phoneNum, profilePicture; update with findByIdAndUpdate, runValidators: true), `deleteMe` (set active: false). Import handlerFactory and assign: `getAllUsers = factory.getAll(User)`, `getUser = factory.getOne(User)`, `createUser` (returns 500 error directing to /signup), `updateUser = factory.updateOne(User)`, `deleteUser = factory.deleteOne(User)`. Export all.
- [x] T006 Create `routes/userRoutes.js` — Define router. Public routes: POST `/signup` → authController.signup, POST `/login` → authController.login, GET `/logout` → authController.logout, POST `/forgotPassword` → authController.forgotPassword, PATCH `/resetPassword/:token` → authController.resetPassword. Then `router.use(authController.protect)` to protect all subsequent routes. Protected routes: PATCH `/updateMyPassword` → authController.updatePassword, GET `/me` → userController.getMe + userController.getUser, PATCH `/updateMe` → userController.updateMe, DELETE `/deleteMe` → userController.deleteMe. Then `router.use(authController.restrictTo('admin'))` for admin-only: GET `/` → getAllUsers, POST `/` → createUser, GET `/:id` → getUser, PATCH `/:id` → updateUser, DELETE `/:id` → deleteUser. Export router.
- [x] T007 Mount user routes in `app.js` — Import userRouter from `./routes/userRoutes`, add `app.use('/api/v1/users', userRouter)` in the ROUTES section before the 404 catch-all.
- [x] T008 Verify: Start server, register a user via POST `/api/v1/users/signup`, login via POST `/api/v1/users/login`, access GET `/api/v1/users/me` with Bearer token, confirm 401 without token, confirm restrictTo blocks non-admin from GET `/api/v1/users`.

**Checkpoint**: Authentication fully working — signup, login, logout, protect, restrictTo, password reset flow. All subsequent phases can use `protect` and `restrictTo`.

---

## Phase 3: User Story 2 — Lesson & Level Management (Priority: P2)

**Goal**: Teachers create levels and lessons. Learners browse and view them.

**Independent Test**: Login as teacher, create a level, create lessons in it. Login as learner, browse levels, get lessons for a level.

### Implementation for User Story 2

- [x] T009 [P] [US2] Create `models/levelModel.js` — Schema with fields: title (String, required, trim, unique), description (String, trim), levelOrder (Number, required), adminId (ObjectId ref: 'User', required), createdAt (Date, default: Date.now). Index on `{ levelOrder: 1 }`. Add virtual populate for `lessons` (ref: 'Lesson', foreignField: 'levelId', localField: '_id'). Enable `toJSON: { virtuals: true }`, `toObject: { virtuals: true }`. Export model.
- [x] T010 [P] [US2] Create `models/lessonModel.js` — Schema with fields: title (String, required, trim), description (String, trim), videoUrl (String, required), thumbnailUrl (String), lessonOrder (Number, required), levelId (ObjectId ref: 'Level', required), teacherId (ObjectId ref: 'User', required), createdAt (Date, default: Date.now). Compound index on `{ levelId: 1, lessonOrder: 1 }`. Add virtual populate for `quizzes` (ref: 'Quiz', foreignField: 'lessonId', localField: '_id'). Export model.
- [x] T011 [US2] Create `controllers/levelController.js` — Import handlerFactory. Implement `setAdminId` middleware (sets req.body.adminId = req.user.id if not set). Assign: getAllLevels = factory.getAll(Level), getLevel = factory.getOne(Level, { path: 'lessons' }), createLevel = factory.createOne(Level), updateLevel = factory.updateOne(Level), deleteLevel = factory.deleteOne(Level). Export all.
- [x] T012 [US2] Create `controllers/lessonController.js` — Import handlerFactory. Implement `setLevelTeacherIds` middleware (sets req.body.levelId from req.params.levelId if nested route, sets req.body.teacherId = req.user.id if not set). Implement `setFilterObj` middleware (sets req.filterObj = { levelId: req.params.levelId } if nested route for getAll). Assign factory handlers for CRUD. Override getOne to populate quizzes. Export all.
- [x] T013 [US2] Create `routes/levelRoutes.js` — Define router. Use `authController.protect` for all routes. GET `/` → getAllLevels, GET `/:id` → getLevel (with lessons). Restrict POST, PATCH, DELETE to teacher+admin. Nest lessonRouter on `/:levelId/lessons` using `router.use('/:levelId/lessons', lessonRouter)`. Export router.
- [x] T014 [US2] Create `routes/lessonRoutes.js` — Define router with `{ mergeParams: true }`. Use `authController.protect` for all routes. GET `/` → setFilterObj + getAllLessons, GET `/:id` → getLesson. Restrict POST, PATCH, DELETE to teacher+admin with setLevelTeacherIds middleware. Nest quizRouter on `/:lessonId/quizzes`. Export router.
- [x] T015 [US2] Mount level and lesson routes in `app.js` — Import levelRouter and lessonRouter, add `app.use('/api/v1/levels', levelRouter)` and `app.use('/api/v1/lessons', lessonRouter)`.
- [x] T016 [US2] Verify: Login as teacher, create a level (POST /api/v1/levels), create a lesson in it (POST /api/v1/levels/:levelId/lessons), login as learner, GET /api/v1/levels returns levels, GET /api/v1/levels/:id returns level with lessons, GET /api/v1/lessons returns all lessons.

**Checkpoint**: Levels and lessons CRUD working. Teachers create, learners browse.

---

## Phase 4: User Story 3 — Quiz System (Priority: P3)

**Goal**: Teachers create quizzes with questions. Learners submit answers and get scored.

**Independent Test**: Login as teacher, create a quiz for a lesson with questions. Login as learner, view quiz, submit answers, receive score.

### Implementation for User Story 3

- [x] T017 [P] [US3] Create `models/quizModel.js` — Schema with fields: title (String, required, trim), lessonId (ObjectId ref: 'Lesson', required), teacherId (ObjectId ref: 'User', required), createdAt (Date, default: Date.now). Index on `{ lessonId: 1 }`. Virtual populate for `questions` (ref: 'Question', foreignField: 'quizId', localField: '_id'). Export model.
- [x] T018 [P] [US3] Create `models/questionModel.js` — Schema with fields: questionText (String, required), questionType (String, enum: [mcq, true-false], default: mcq), marks (Number, required, default: 1), options (Array of { text: String required, isCorrect: Boolean required }, validate min 2 options), quizId (ObjectId ref: 'Quiz', required). Index on `{ quizId: 1 }`. Export model.
- [x] T019 [P] [US3] Create `models/quizAttemptModel.js` — Schema with fields: userId (ObjectId ref: 'User', required), quizId (ObjectId ref: 'Quiz', required), score (Number, required), passed (Boolean, required), createdAt (Date, default: Date.now). Index on `{ userId: 1, quizId: 1 }`. Export model.
- [x] T020 [P] [US3] Create `models/userAnswerModel.js` — Schema with fields: attemptId (ObjectId ref: 'QuizAttempt', required), questionId (ObjectId ref: 'Question', required), selectedOptionId (Number, required). Index on `{ attemptId: 1 }`. Export model.
- [x] T021 [US3] Create `controllers/quizController.js` — Import handlerFactory. Implement `setLessonTeacherIds` middleware (sets lessonId from params if nested, teacherId from req.user). Implement `setFilterObj` for nested route filtering. Assign factory CRUD handlers. Override getOne to populate questions. Export all.
- [x] T022 [US3] Create `controllers/questionController.js` — Import handlerFactory. Implement `setQuizId` middleware (sets quizId from params if nested). Implement `setFilterObj` for nested route filtering. Assign factory CRUD handlers. Export all.
- [x] T023 [US3] Create `controllers/quizAttemptController.js` — Implement `submitQuiz` (custom handler): extract quizId + answers array from req.body, fetch all questions for quizId, calculate score by comparing each answer's selectedOptionId against question.options[index].isCorrect, sum marks for correct answers, determine passed (score >= 60% of total marks), create QuizAttempt document, bulk-create UserAnswer documents for each answer, return attempt with score. Implement `getMyAttempts` (filter by req.user.id, populate quizId). Implement `getAttempt` using factory.getOne with populate. Export all.
- [x] T024 [US3] Create `routes/quizRoutes.js` — Define router with `{ mergeParams: true }`. Protect all routes. GET `/` → setFilterObj + getAllQuizzes, GET `/:id` → getQuiz with questions. Restrict POST, PATCH, DELETE to teacher+admin. Nest questionRouter on `/:quizId/questions`. Export router.
- [x] T025 [US3] Create `routes/questionRoutes.js` — Define router with `{ mergeParams: true }`. Protect all. GET `/` → setFilterObj + getAllQuestions, GET `/:id` → getQuestion. Restrict POST, PATCH, DELETE to teacher+admin with setQuizId middleware. Export router.
- [x] T026 [US3] Create `routes/quizAttemptRoutes.js` — Define router. Protect all. POST `/` → submitQuiz (user role only). GET `/my-attempts` → getMyAttempts. GET `/:id` → getAttempt. Export router.
- [x] T027 [US3] Mount quiz, question, and attempt routes in `app.js` — Import quizRouter, questionRouter, quizAttemptRouter. Add `app.use('/api/v1/quizzes', quizRouter)`, `app.use('/api/v1/questions', questionRouter)`, `app.use('/api/v1/quiz-attempts', quizAttemptRouter)`.
- [x] T028 [US3] Verify: Login as teacher, create quiz (POST /api/v1/lessons/:lessonId/quizzes), add questions (POST /api/v1/quizzes/:quizId/questions). Login as learner, GET quiz with questions, POST /api/v1/quiz-attempts with answers, confirm score and passed flag returned.

**Checkpoint**: Quiz system working — create quizzes, add questions, submit answers, receive scores.

---

## Phase 5: User Story 4 — Learning Progress Tracking (Priority: P4)

**Goal**: Learners mark lessons complete. Progress is tracked and queryable by learner and teacher.

**Independent Test**: Login as learner, mark a lesson complete, view own progress. Login as teacher, view a learner's progress.

### Implementation for User Story 4

- [x] T029 [P] [US4] Create `models/lessonProgressModel.js` — Schema with fields: userId (ObjectId ref: 'User', required), lessonId (ObjectId ref: 'Lesson', required), completedAt (Date, default: Date.now). Compound unique index on `{ userId: 1, lessonId: 1 }` to prevent duplicates. Export model.
- [x] T030 [US4] Create `controllers/lessonProgressController.js` — Implement `markComplete` (custom handler): set userId from req.user.id, check if progress already exists for this user+lesson pair, if yes return 400 "Already completed", else create LessonProgress and return 201. Implement `getMyProgress` (filter by req.user.id, populate lessonId with title). Implement `getUserProgress` (filter by req.params.userId, restricted to teacher+admin). Export all.
- [x] T031 [US4] Create `routes/lessonProgressRoutes.js` — Define router. Protect all. POST `/` → markComplete. GET `/my-progress` → getMyProgress. GET `/user/:userId` → restrictTo(teacher, admin) + getUserProgress. Export router.
- [x] T032 [US4] Mount progress routes in `app.js` — Import lessonProgressRouter, add `app.use('/api/v1/progress', lessonProgressRouter)`.
- [x] T033 [US4] Verify: Login as learner, POST /api/v1/progress with lessonId, confirm 201. Retry same lesson, confirm 400 duplicate. GET /api/v1/progress/my-progress, confirm list. Login as teacher, GET /api/v1/progress/user/:userId, confirm teacher can see learner's progress.

**Checkpoint**: Progress tracking working — mark complete, prevent duplicates, query by self and by teacher.

---

## Phase 6: User Story 5 — Community Posts & Interactions (Priority: P5)

**Goal**: Users create posts, comment, like/unlike, and report. Admins/teachers moderate.

**Independent Test**: Create a post, add comment, toggle like, report it, admin reviews report.

### Implementation for User Story 5

- [x] T034 [P] [US5] Create `models/postModel.js` — Schema with fields: content (String, required, trim), mediaUrl (String), status (String, enum: [active, hidden, deleted], default: active), userId (ObjectId ref: 'User', required), teacherId (ObjectId ref: 'User'), createdAt (Date, default: Date.now). Indexes on `{ userId: 1 }`, `{ createdAt: -1 }`. Virtual populate for comments and likes. Add pre-find query middleware to filter out `{ status: 'deleted' }` by default. Enable virtuals in toJSON/toObject. Export model.
- [x] T035 [P] [US5] Create `models/commentModel.js` — Schema with fields: content (String, required, trim), postId (ObjectId ref: 'Post', required), userId (ObjectId ref: 'User', required), createdAt (Date, default: Date.now). Index on `{ postId: 1 }`. Export model.
- [x] T036 [P] [US5] Create `models/likeModel.js` — Schema with fields: postId (ObjectId ref: 'Post', required), userId (ObjectId ref: 'User', required). Compound unique index on `{ postId: 1, userId: 1 }`. Export model.
- [x] T037 [P] [US5] Create `models/reportModel.js` — Schema with fields: postId (ObjectId ref: 'Post', required), userId (ObjectId ref: 'User', required), teacherId (ObjectId ref: 'User'), reason (String, required, trim), status (String, enum: [pending, reviewed, dismissed], default: pending), createdAt (Date, default: Date.now). Indexes on `{ postId: 1 }`, `{ status: 1 }`. Export model.
- [x] T038 [US5] Create `controllers/postController.js` — Import handlerFactory. Implement `setUserId` middleware (sets req.body.userId = req.user.id). Assign factory CRUD handlers with Post model. Override getAllPosts to populate userId with firstName and profilePicture. Export all.
- [x] T039 [US5] Create `controllers/commentController.js` — Import handlerFactory. Implement `setPostUserId` middleware (sets postId from params, userId from req.user). Implement `setFilterObj` for nested route. Assign factory CRUD handlers with Comment model. Export all.
- [x] T040 [US5] Create `controllers/likeController.js` — Implement `toggleLike` (custom handler): extract postId from params, userId from req.user, try to find existing like with { postId, userId }, if found delete it and return { liked: false }, if not found create it and return { liked: true }. Export all.
- [x] T041 [US5] Create `controllers/reportController.js` — Import handlerFactory. Implement `setPostUserId` middleware. Implement `createReport` using factory.createOne(Report). Implement `getAllReports` using factory.getAll(Report) restricted to teacher+admin. Implement `updateReport` using factory.updateOne(Report) restricted to teacher+admin. Export all.
- [x] T042 [US5] Create `routes/postRoutes.js` — Define router. Protect all. GET `/` → getAllPosts, GET `/:id` → getPost, POST `/` → setUserId + createPost. PATCH `/:id` → updatePost, DELETE `/:id` → deletePost. Nest commentRouter on `/:postId/comments`, likeRouter on `/:postId/likes`, reportRouter on `/:postId/reports`. Export router.
- [x] T043 [US5] Create `routes/commentRoutes.js` — Define router with `{ mergeParams: true }`. Protect all. GET `/` → setFilterObj + getAllComments. POST `/` → setPostUserId + createComment. DELETE `/:id` → deleteComment. Export router.
- [x] T044 [US5] Create `routes/likeRoutes.js` — Define router with `{ mergeParams: true }`. Protect all. POST `/` → toggleLike. Export router.
- [x] T045 [US5] Create `routes/reportRoutes.js` — Define router with `{ mergeParams: true }`. Protect all. POST `/` → setPostUserId + createReport. GET `/` → restrictTo(teacher, admin) + getAllReports (also mount at top level). PATCH `/:id` → restrictTo(teacher, admin) + updateReport. Export router.
- [x] T046 [US5] Mount community routes in `app.js` — Import postRouter, commentRouter, likeRouter, reportRouter. Add `app.use('/api/v1/posts', postRouter)`, `app.use('/api/v1/comments', commentRouter)`, `app.use('/api/v1/reports', reportRouter)`.
- [x] T047 [US5] Verify: Login as user, create post (POST /api/v1/posts), add comment (POST /api/v1/posts/:id/comments), toggle like (POST /api/v1/posts/:id/likes), report post (POST /api/v1/posts/:id/reports). Login as admin, GET /api/v1/reports, PATCH report status.

**Checkpoint**: Community fully working — posts, comments, likes toggle, reports, moderation.

---

## Phase 7: User Story 6 — Notification System (Priority: P6)

**Goal**: Notifications are created for users and can be retrieved and marked as read.

**Independent Test**: Create a notification (as admin), retrieve notifications as user, mark as read, check unread count.

### Implementation for User Story 6

- [x] T048 [P] [US6] Create `models/notificationModel.js` — Schema with fields: type (String, required, enum: [lesson, quiz, community, system, announcement]), message (String, required), link (String), userId (ObjectId ref: 'User', required), adminId (ObjectId ref: 'User'), teacherId (ObjectId ref: 'User'), read (Boolean, default: false), createdAt (Date, default: Date.now). Indexes on `{ userId: 1, read: 1 }`, `{ createdAt: -1 }`. Export model.
- [x] T049 [US6] Create `controllers/notificationController.js` — Implement `getMyNotifications` (filter by req.user.id, sort by -createdAt, use APIFeatures for pagination). Implement `markAsRead` (find notification by id, verify ownership via req.user.id, update read to true). Implement `getUnreadCount` (count documents where userId = req.user.id and read = false, return { unreadCount }). Implement `createNotification` using factory.createOne(Notification) restricted to admin+teacher. Export all.
- [x] T050 [US6] Create `routes/notificationRoutes.js` — Define router. Protect all. GET `/` → getMyNotifications. GET `/unread-count` → getUnreadCount. PATCH `/:id` → markAsRead. POST `/` → restrictTo(admin, teacher) + createNotification. Export router.
- [x] T051 [US6] Mount notification routes in `app.js` — Import notificationRouter, add `app.use('/api/v1/notifications', notificationRouter)`.
- [x] T052 [US6] Verify: Login as admin, POST /api/v1/notifications to create one for a user. Login as that user, GET /api/v1/notifications, confirm notification listed. GET /api/v1/notifications/unread-count, confirm count. PATCH /api/v1/notifications/:id to mark read, confirm count decreases.

**Checkpoint**: Notification system working — create, list, mark read, unread count.

---

## Phase 8: User Story 7 — Database Seeding (Priority: P7)

**Goal**: Seeding script populates all entities with sample data.

**Independent Test**: Run import script, verify all collections populated. Run delete script, verify all cleared.

### Implementation for User Story 7

- [x] T053 [P] [US7] Create `dev-data/data/users.json` — 5 sample users: 1 admin (admin@sout-elyad.com, role: admin), 2 teachers (teacher@sout-elyad.com, teacher2@sout-elyad.com, role: teacher), 2 learners (user@sout-elyad.com, user2@sout-elyad.com, role: user). All with password "password123", firstName, lastName, email, phoneNum.
- [x] T054 [P] [US7] Create `dev-data/data/levels.json` — 4 levels: Basics (order 1), Daily Life (order 2), Advanced Concepts (order 3), Real-time Translation (order 4). Each with title, description, levelOrder. Use placeholder adminId (will be replaced with actual ObjectId after user import or use a fixed ObjectId).
- [x] T055 [P] [US7] Create `dev-data/data/lessons.json` — 8 lessons: 2 per level. Each with title, description, videoUrl (placeholder), thumbnailUrl (placeholder), lessonOrder, levelId (reference), teacherId (reference).
- [x] T056 [P] [US7] Create `dev-data/data/quizzes.json` — 4 quizzes: 1 per 2 lessons. Each with title, lessonId (reference), teacherId (reference).
- [x] T057 [P] [US7] Create `dev-data/data/questions.json` — 12 questions: 3 per quiz. Each with questionText, questionType (mcq), marks, options array with text and isCorrect, quizId (reference).
- [x] T058 [P] [US7] Create `dev-data/data/posts.json` — 5 sample community posts with content, userId (reference), createdAt.
- [x] T059 [US7] Create `dev-data/import-dev-data.js` — Load dotenv from `../../config.env`, connect to MongoDB via Mongoose. Read all JSON files from `./data/`. Implement `importData` function: delete all collections first, then Model.create() for each dataset in dependency order (Users → Levels → Lessons → Quizzes → Questions → Posts). Implement `deleteData` function: delete all collections. Parse process.argv for `--import` and `--delete` flags. Call appropriate function and exit.
- [x] T060 [US7] Verify: Run `node dev-data/import-dev-data.js --import`, confirm data in MongoDB. Run `node dev-data/import-dev-data.js --delete`, confirm all cleared. Re-import and login with sample credentials.

**Checkpoint**: Seeding script functional — import and delete work for all entities.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, middleware order, and lint check.

- [x] T061 Validate all routes are mounted in `app.js` in correct order — Confirm middleware order: (1) existing security middleware, (2) all route mounts (users, levels, lessons, quizzes, questions, quiz-attempts, progress, posts, comments, reports, notifications), (3) 404 catch-all, (4) global error handler. Verify no route is missing.
- [x] T062 Run `npm run lint` on all new files and fix any errors until lint passes with zero errors.
- [x] T063 Run full quickstart validation — Follow every step in `specs/002-core-backend/quickstart.md`: install deps, update config.env, seed DB, start server, register user, login, access protected route, get levels, get lessons, create post.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (npm install complete)
- **US2 (Phase 3)**: Depends on Phase 2 (User model + auth available)
- **US3 (Phase 4)**: Depends on Phase 3 (Lesson model exists for quiz references)
- **US4 (Phase 5)**: Depends on Phase 3 (Lesson model exists for progress references)
- **US5 (Phase 6)**: Depends on Phase 2 (auth available). Can run in parallel with US2-US4.
- **US6 (Phase 7)**: Depends on Phase 2 (auth available). Can run in parallel with US2-US5.
- **US7 (Phase 8)**: Depends on ALL user stories complete (needs all models for seeding)
- **Polish (Phase 9)**: Depends on all phases complete

### User Story Dependencies

- **US1 (P1)**: Auth — implemented in Phase 2 (Foundational). Creates User model + auth.
- **US2 (P2)**: Levels & Lessons — depends on auth (Phase 2)
- **US3 (P3)**: Quizzes — depends on Lesson model (Phase 3/US2)
- **US4 (P4)**: Progress — depends on Lesson model (Phase 3/US2). Can run in parallel with US3.
- **US5 (P5)**: Community — depends only on auth (Phase 2). Can run in parallel with US2-US4.
- **US6 (P6)**: Notifications — depends only on auth (Phase 2). Can run in parallel with US2-US5.
- **US7 (P7)**: Seeding — depends on all models existing.

### Within Each User Story

- Models first (can be parallel if different files)
- Controllers after models (same story, sequential)
- Routes after controllers
- Route mounting in app.js after routes
- Verification task always last

### Parallel Opportunities

- **Phase 2**: T003 (userModel) must complete before T004 (authController)
- **Phase 3**: T009 (levelModel) and T010 (lessonModel) are parallel
- **Phase 4**: T017, T018, T019, T020 (all quiz models) are parallel
- **Phase 5**: T029 (progressModel) is independent
- **Phase 6**: T034, T035, T036, T037 (all community models) are parallel
- **Phase 7**: T048 (notificationModel) is independent
- **Phase 8**: T053–T058 (all JSON files) are parallel
- **US4 and US5**: Can start in parallel after Phase 3 and Phase 2 respectively
- **US6**: Can start in parallel with US2–US5

---

## Parallel Example: Phase 4 (Quiz Models)

```bash
# All four model files can be created simultaneously:
Task T017: "Create models/quizModel.js"
Task T018: "Create models/questionModel.js"
Task T019: "Create models/quizAttemptModel.js"
Task T020: "Create models/userAnswerModel.js"
```

## Parallel Example: Phase 6 (Community Models)

```bash
# All four model files can be created simultaneously:
Task T034: "Create models/postModel.js"
Task T035: "Create models/commentModel.js"
Task T036: "Create models/likeModel.js"
Task T037: "Create models/reportModel.js"
```

---

## Implementation Strategy

### MVP First (Phase 2 Only)

1. Complete Phase 1: Setup (T001–T002)
2. Complete Phase 2: Foundational / Auth (T003–T008)
3. **STOP and VALIDATE**: signup → login → protected route → role check
4. Auth is working — minimal viable backend with user management

### Incremental Delivery

1. Setup + Foundational → Auth working (MVP!)
2. Add US2 → Levels and lessons browsable
3. Add US3 → Quizzes and scoring
4. Add US4 → Progress tracking
5. Add US5 → Community features
6. Add US6 → Notifications
7. Add US7 → Database seeded with sample data
8. Polish → Lint clean, full validation

### Recommended Execution Order (Solo Developer)

Phase 1 → Phase 2 → Phase 3 (US2) → Phase 4 (US3) →
Phase 5 (US4) → Phase 6 (US5) → Phase 7 (US6) →
Phase 8 (US7) → Phase 9 (Polish)

Total estimated tasks: 63

---

## Notes

- All tasks target the repository root — no `src/` prefix (Natours convention)
- `app.js` is updated in T007, T015, T027, T032, T046, T051 (route mounting)
- US1 (Auth) is embedded in Phase 2 (Foundational) since all other stories depend on it
- Tasks within a user story are sequential when touching the same file
- No automated tests in this feature — manual Postman/curl verification
- Each verification task (T008, T016, T028, T033, T047, T052, T060, T063) is a manual check
- JSON seed files use placeholder ObjectIds; the import script handles ordering
