# Feature Specification: Core Backend — Models, Auth, Routes & Seeding

**Feature Branch**: `002-core-backend`
**Created**: 2026-02-07
**Status**: Draft
**Input**: User description: "Models, controllers, routes, auth, database interaction and database seeding scripts based on ERD and project requirements"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — User Registration & Authentication (Priority: P1)

Users (learners), teachers, and admins can create accounts, log in with
email and password, receive a secure token, and access protected
resources based on their role. Password reset via email is supported.

**Why this priority**: Authentication is the gateway to every other
feature. No lesson, quiz, community, or progress feature works without
knowing who the user is and what role they hold.

**Independent Test**: Register a new user, log in, receive a token, access
a protected route, attempt access without a token and get rejected. Reset
password via email flow.

**Acceptance Scenarios**:

1. **Given** no account exists, **When** a user submits valid registration
   data (firstName, lastName, email, password, passwordConfirm),
   **Then** the system creates the account, returns a token, and sets an
   HttpOnly cookie.
2. **Given** a registered account, **When** the user logs in with correct
   credentials, **Then** the system returns a token and user data.
3. **Given** incorrect credentials, **When** the user attempts login,
   **Then** the system returns a 401 error with "Incorrect email or
   password".
4. **Given** a valid token, **When** a user accesses a protected route,
   **Then** the request succeeds with the user's data attached.
5. **Given** no token or an expired token, **When** a user accesses a
   protected route, **Then** the system returns 401 "Not logged in".
6. **Given** a user role is "user", **When** they attempt a teacher-only
   action, **Then** the system returns 403 "You do not have permission".
7. **Given** a registered email, **When** the user requests a password
   reset, **Then** the system sends a reset token via email (valid for
   10 minutes).
8. **Given** a valid reset token, **When** the user submits a new
   password, **Then** the password is updated and a new login token is
   returned.

---

### User Story 2 — Lesson & Level Management (Priority: P2)

Teachers create and manage structured learning content organized into
levels. Each level contains ordered lessons with titles, descriptions,
video URLs, and thumbnail images. Learners browse levels and watch
lessons sequentially.

**Why this priority**: Lessons are the core educational content of the
platform. Without lessons, there is nothing to learn, quiz on, or track
progress for.

**Independent Test**: A teacher creates a level, adds lessons to it, a
learner browses available levels and retrieves lesson details.

**Acceptance Scenarios**:

1. **Given** a teacher is authenticated, **When** they create a level
   with title, description, and order, **Then** the system stores the
   level and returns it.
2. **Given** a level exists, **When** a teacher creates a lesson with
   title, description, videoUrl, thumbnailUrl, and assigns it to the
   level, **Then** the lesson is stored with the correct level
   reference and lesson order.
3. **Given** lessons exist, **When** a learner requests all lessons for
   a level, **Then** the system returns lessons sorted by lessonOrder.
4. **Given** a lesson exists, **When** a learner requests its details,
   **Then** the system returns the full lesson data.
5. **Given** a teacher is authenticated, **When** they update a lesson's
   title or video URL, **Then** the changes are persisted.
6. **Given** a teacher is authenticated, **When** they delete a lesson,
   **Then** it is removed from the database.

---

### User Story 3 — Quiz System (Priority: P3)

Teachers create quizzes linked to lessons. Each quiz has multiple
questions with a question type, text, marks, and a correct answer
option. Learners take quizzes, submit answers, and receive scores.
Quiz attempts and individual answers are recorded.

**Why this priority**: Quizzes assess learner understanding and are
tightly coupled with the lesson content. Progress tracking depends on
quiz completion.

**Independent Test**: A teacher creates a quiz with questions for a
lesson, a learner submits answers, the system scores the attempt and
records results.

**Acceptance Scenarios**:

1. **Given** a teacher is authenticated, **When** they create a quiz
   linked to a lesson with title and questions, **Then** the quiz and
   its questions are stored.
2. **Given** a quiz exists, **When** a learner retrieves quiz details,
   **Then** the system returns the quiz with its questions (without
   revealing correct answers).
3. **Given** a quiz exists, **When** a learner submits answers,
   **Then** the system creates a QuizAttempt with the calculated score,
   a passed/failed flag, and stores each UserAnswer.
4. **Given** a learner has completed quizzes, **When** they request
   their attempts, **Then** the system returns all attempts with
   scores and timestamps.

---

### User Story 4 — Learning Progress Tracking (Priority: P4)

The system tracks each learner's progress through lessons and levels.
When a learner completes a lesson, a LessonProgress record is created.
Learners and teachers can view progress data.

**Why this priority**: Progress tracking motivates learners and enables
teachers to monitor performance. It depends on lessons and quizzes
existing first.

**Independent Test**: A learner marks a lesson as complete, their
progress is recorded, they can view their overall progress, and a
teacher can view a student's progress.

**Acceptance Scenarios**:

1. **Given** a learner watches a lesson, **When** they mark it complete,
   **Then** a LessonProgress record is created with userId and
   lessonId.
2. **Given** progress records exist, **When** a learner requests their
   progress, **Then** the system returns all completed lessons.
3. **Given** a teacher is authenticated, **When** they request a
   learner's progress, **Then** the system returns that learner's
   progress records.
4. **Given** a learner has no progress for a lesson, **When** they
   request progress, **Then** the system returns an empty result.

---

### User Story 5 — Community Posts & Interactions (Priority: P5)

Learners and teachers can create posts in the community space. Other
users can comment on posts, like/unlike them, and report inappropriate
content. Teachers and admins can moderate reported posts.

**Why this priority**: Community features add social engagement but are
not required for core learning functionality. They enhance retention.

**Independent Test**: A user creates a post, another user comments and
likes it, a third user reports it, an admin reviews and acts on the
report.

**Acceptance Scenarios**:

1. **Given** a user is authenticated, **When** they create a post with
   text content and optional media URL, **Then** the post appears in
   the community feed.
2. **Given** a post exists, **When** a user adds a comment, **Then**
   the comment is stored with reference to the post and user.
3. **Given** a post exists, **When** a user likes it, **Then** a Like
   record is created. If they like again, the like is removed (toggle).
4. **Given** a post exists, **When** a user reports it with a reason,
   **Then** a Report record is created for admin review.
5. **Given** reports exist, **When** an admin retrieves reported posts,
   **Then** the system returns posts with their report details.
6. **Given** a reported post, **When** an admin changes its status
   (hidden/deleted), **Then** the post is no longer visible in the
   community feed.

---

### User Story 6 — Notification System (Priority: P6)

The system generates notifications for users when relevant events occur
(new lesson available, quiz results, community replies, admin
announcements). Users can view and mark notifications as read.

**Why this priority**: Notifications are a supporting feature that
enhances engagement but is not required for core learning.

**Independent Test**: An event triggers a notification creation, the
user retrieves their notification list, marks one as read, and the
unread count decreases.

**Acceptance Scenarios**:

1. **Given** a notification-triggering event occurs, **When** the
   system processes it, **Then** a notification record is created for
   the target user(s) with type, message, and optional link.
2. **Given** notifications exist for a user, **When** they request
   their notifications, **Then** the system returns them sorted by
   most recent, with unread status.
3. **Given** an unread notification, **When** the user marks it as
   read, **Then** the notification's read status is updated.
4. **Given** a user has notifications, **When** they request the unread
   count, **Then** the system returns the correct number.

---

### User Story 7 — Database Seeding (Priority: P7)

A developer can run a seeding script to populate the database with
sample data for all entities (users, lessons, levels, quizzes,
questions, posts) to enable rapid development and testing.

**Why this priority**: Seeding is a developer tool that supports all
other stories but is not end-user facing. It is the lowest priority
but essential for development workflow.

**Independent Test**: Run the seed script, verify the database contains
sample users (one of each role), levels, lessons, quizzes with
questions, and community posts.

**Acceptance Scenarios**:

1. **Given** an empty database, **When** the seed script runs,
   **Then** it creates sample users (admin, teacher, learner), levels,
   lessons, quizzes with questions, and community posts.
2. **Given** an already-seeded database, **When** the seed script runs
   with a "delete" flag, **Then** all existing data is cleared first
   before re-seeding.

---

### Edge Cases

- What happens when a user registers with an email that already exists?
  The system returns a duplicate key error with a user-friendly message.
- What happens when a quiz is submitted with missing answers? The system
  treats unanswered questions as incorrect and scores accordingly.
- What happens when a user tries to like their own post? The system
  allows it (standard social media behavior).
- What happens when a deleted user's posts remain? Posts retain author
  reference but display as "deleted user" if the account no longer exists.
- What happens when a teacher deletes a lesson that has quiz attempts?
  The lesson is soft-deleted or the system prevents deletion if attempts
  exist.
- What happens when a password reset token is used twice? The system
  rejects the second attempt as the token is cleared after first use.

## Requirements *(mandatory)*

### Functional Requirements

**Authentication & Users**

- **FR-001**: System MUST allow users to register with firstName, lastName, email, password, passwordConfirm, and optional phoneNum and profilePicture.
- **FR-002**: System MUST validate that email is unique and password meets minimum length (8 characters).
- **FR-003**: System MUST hash passwords before storing them in the database.
- **FR-004**: System MUST authenticate users via email and password, returning a signed token and setting an HttpOnly cookie.
- **FR-005**: System MUST support three roles: user (default), teacher, and admin.
- **FR-006**: System MUST protect routes with token verification middleware and role-based access control.
- **FR-007**: System MUST support password reset via email with a time-limited token (10 minutes).
- **FR-008**: System MUST allow users to update their own profile (name, email, phone, photo) and change their password.
- **FR-009**: System MUST allow admins to manage (view, update, deactivate) any user account.

**Lessons & Levels**

- **FR-010**: System MUST allow teachers to create, read, update, and delete levels with title, description, and order.
- **FR-011**: System MUST allow teachers to create, read, update, and delete lessons with title, description, videoUrl, thumbnailUrl, lessonOrder, and level reference.
- **FR-012**: System MUST return lessons sorted by lessonOrder within a level.
- **FR-013**: System MUST allow learners to browse all levels and retrieve lessons for a specific level.

**Quizzes**

- **FR-014**: System MUST allow teachers to create quizzes linked to a lesson, each with a title.
- **FR-015**: System MUST allow teachers to add questions to a quiz with questionText, questionType, marks, and correct answer identification.
- **FR-016**: System MUST allow learners to submit quiz answers and receive an auto-calculated score.
- **FR-017**: System MUST store each quiz attempt with userId, quizId, score, passed status, and timestamp.
- **FR-018**: System MUST store each user answer with attemptId, questionId, and selectedOptionId.

**Progress Tracking**

- **FR-019**: System MUST create a LessonProgress record when a learner completes a lesson.
- **FR-020**: System MUST prevent duplicate progress records for the same user-lesson pair.
- **FR-021**: System MUST allow learners to view their own progress and teachers to view any learner's progress.

**Community**

- **FR-022**: System MUST allow authenticated users to create posts with content, optional mediaUrl, and auto-set status.
- **FR-023**: System MUST allow users to comment on posts with content text.
- **FR-024**: System MUST support like/unlike toggle on posts per user.
- **FR-025**: System MUST allow users to report posts with a reason.
- **FR-026**: System MUST allow admins and teachers to moderate reported posts (update status to hidden or deleted).

**Notifications**

- **FR-027**: System MUST store notifications with type, message, optional link, recipient userId, and read status.
- **FR-028**: System MUST allow users to retrieve their notifications (sorted by most recent) and mark them as read.

**Seeding**

- **FR-029**: System MUST provide a seeding script that populates the database with sample data for all entities.
- **FR-030**: System MUST support a delete-and-reseed option in the seeding script.

### Key Entities

Based on the ERD provided:

- **User**: Learner account with firstName, lastName, email, password, phoneNum, profilePicture, role (user/teacher/admin). Central entity referenced by most other entities.
- **Level**: Learning level grouping with title, description, levelOrder. Contains multiple lessons.
- **Lesson**: Educational content with title, description, videoUrl, thumbnailUrl, lessonOrder. Belongs to a level, created by a teacher (or admin).
- **Quiz**: Assessment linked to a lesson with title. Created by a teacher. Contains multiple questions.
- **Question**: Quiz question with questionText, questionType, marks, quizId. Has options/correct answer identification.
- **QuizAttempt**: Record of a user taking a quiz with score, passed flag, createdAt. References userId and quizId.
- **UserAnswer**: Individual answer in a quiz attempt with attemptId, questionId, selectedOptionId.
- **LessonProgress**: Tracks lesson completion per user with userId and lessonId.
- **Post**: Community post with content, optional mediaUrl, status, createdAt. References userId (and optionally teacherId).
- **Comment**: Response to a post with content, createdAt. References postId and userId.
- **Like**: Toggle-based reaction to a post. References postId and userId (unique pair).
- **Report**: Flagged content report with reason, status. References postId and reporting userId.
- **Notification**: System message with type, message, link, readStatus, createdAt. References recipient userId. Optionally references sender (admin/teacher).

## Scope

### In Scope

- All Mongoose models for the entities listed above
- Authentication (register, login, logout, forgot/reset password, update password)
- Role-based access control (user, teacher, admin)
- Full CRUD controllers and routes for all entities
- Database seeding script with sample data
- Integration with existing middleware stack from 001-project-init

### Out of Scope

- AI gesture recognition engine (frontend handles TensorFlow.js)
- AI chat sessions (deferred to a future feature)
- Email sending implementation (structure the reset token flow but actual email transport is a future feature)
- File upload/image storage (URLs are stored as strings; actual upload service is deferred)
- Frontend (React app in separate repo)
- Real-time notifications via WebSocket (REST polling only for now)
- Report generation (PDF/Excel export deferred)
- Feedback entity (deferred — similar to notifications but admin-focused)

### Assumptions

- JWT is the authentication mechanism (HttpOnly cookie + response body), following Natours conventions.
- Password hashing uses bcryptjs with cost factor 12.
- Single "User" model covers all three roles (user, teacher, admin) via a role field, matching the ERD structure.
- Email transport for password reset will be stubbed (log the reset URL to console) until an email feature is implemented.
- Quiz questions use a simple model where the correct answer is identified by an option index or reference.
- The community moderation model follows: user creates post -> another user reports -> admin/teacher reviews report and updates post status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can register and log in within 30 seconds, receiving a valid authentication token.
- **SC-002**: All protected routes reject unauthenticated requests with appropriate error codes (401/403) 100% of the time.
- **SC-003**: A teacher can create a complete lesson structure (level + lesson + quiz with questions) in a single workflow session.
- **SC-004**: A learner can submit quiz answers and see their score immediately upon submission.
- **SC-005**: The seeding script populates a fresh database with usable sample data for all entities in under 10 seconds.
- **SC-006**: All CRUD operations for every entity follow consistent response envelope format and consistent error handling.
- **SC-007**: Community post interactions (create, comment, like, report) each complete in under 1 second for the end user.
- **SC-008**: The system correctly enforces role-based access: users cannot access teacher/admin routes, teachers cannot access admin-only routes.
