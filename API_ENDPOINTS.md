# Sout-Elyad API Endpoints

## Base URL
```
https://souteliad-production.up.railway.app/api/v1
```

## Authentication
Routes marked with 🔒 require JWT token in header:
```
Authorization: Bearer <token>
```

---

## Auth / Users — `/api/v1/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/users/signup` | Public | Register new user |
| POST | `/users/login` | Public | Login |
| GET | `/users/logout` | Public | Logout |
| POST | `/users/forgotPassword` | Public | Request password reset |
| PATCH | `/users/resetPassword/:token` | Public | Reset password |
| GET | `/users/me` | 🔒 | Get my profile |
| PATCH | `/users/updateMe` | 🔒 | Update my profile (supports image upload) |
| PATCH | `/users/updateMyPassword` | 🔒 | Change password |
| DELETE | `/users/deleteMe` | 🔒 | Delete my account |

---

## Levels — `/api/v1/levels`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/levels` | Public | Get all levels |
| GET | `/levels/with-lessons` | Public | Get all levels with their lessons |
| GET | `/levels/:id` | Public | Get single level |
| POST | `/levels` | 🔒 Teacher/Admin | Create level |
| PATCH | `/levels/:id` | 🔒 Teacher/Admin | Update level |
| DELETE | `/levels/:id` | 🔒 Teacher/Admin | Delete level |

---

## Lessons — `/api/v1/lessons`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/lessons` | Public | Get all lessons |
| GET | `/lessons/:id` | Public | Get single lesson |
| GET | `/levels/:levelId/lessons` | Public | Get lessons by level |
| POST | `/lessons` | 🔒 Teacher/Admin | Create lesson |
| PATCH | `/lessons/:id` | 🔒 Teacher/Admin | Update lesson |
| DELETE | `/lessons/:id` | 🔒 Teacher/Admin | Delete lesson |

---

## Quizzes — `/api/v1/quizzes`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/quizzes` | 🔒 | Get all quizzes |
| GET | `/quizzes/:id` | 🔒 | Get single quiz |
| GET | `/lessons/:lessonId/quizzes` | 🔒 | Get quizzes by lesson |
| POST | `/quizzes` | 🔒 Teacher/Admin | Create quiz |
| PATCH | `/quizzes/:id` | 🔒 Teacher/Admin | Update quiz |
| DELETE | `/quizzes/:id` | 🔒 Teacher/Admin | Delete quiz |

---

## Questions — `/api/v1/questions`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/questions` | 🔒 | Get all questions |
| GET | `/questions/:id` | 🔒 | Get single question |
| GET | `/quizzes/:quizId/questions` | 🔒 | Get questions by quiz |
| POST | `/questions` | 🔒 Teacher/Admin | Create question (supports image upload) |
| PATCH | `/questions/:id` | 🔒 Teacher/Admin | Update question |
| DELETE | `/questions/:id` | 🔒 Teacher/Admin | Delete question |

---

## Quiz Attempts — `/api/v1/quiz-attempts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/quiz-attempts` | 🔒 | Submit quiz answers |
| GET | `/quiz-attempts/my-attempts` | 🔒 | Get my attempts |
| GET | `/quiz-attempts/:id` | 🔒 | Get single attempt |

---

## Lesson Progress — `/api/v1/progress`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/progress` | 🔒 | Mark lesson as complete |
| GET | `/progress/my-progress` | 🔒 | Get my progress |
| GET | `/progress/user/:userId` | 🔒 Teacher/Admin | Get user progress |

---

## Community Posts — `/api/v1/posts`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts` | 🔒 | Get all posts |
| POST | `/posts` | 🔒 | Create post |
| GET | `/posts/:id` | 🔒 | Get single post |
| PATCH | `/posts/:id` | 🔒 | Update post |
| DELETE | `/posts/:id` | 🔒 | Delete post (owner only) |

---

## Comments — `/api/v1/comments`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/posts/:postId/comments` | 🔒 | Get comments on a post |
| POST | `/posts/:postId/comments` | 🔒 | Add comment to post |
| DELETE | `/comments/:id` | 🔒 | Delete comment (owner only) |

---

## Notifications — `/api/v1/notifications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | 🔒 | Get my notifications |
| GET | `/notifications/unread-count` | 🔒 | Get unread count |
| PATCH | `/notifications/:id` | 🔒 | Mark as read |
| POST | `/notifications` | 🔒 Teacher/Admin | Create notification |

---

## AI Practice — `/api/v1/ai-practice`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ai-practice/:questionId` | 🔒 | Upload video + get AI feedback (max 50MB) |
| GET | `/ai-practice/:questionId/my-results` | 🔒 | Get my practice history |

---

## Stats — `/api/v1/stats`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/stats/public` | Public | Get public stats |
| GET | `/stats/student` | 🔒 | Get my stats |
| GET | `/stats/students` | 🔒 Teacher/Admin | Get all students stats |
| GET | `/stats/teacher-dashboard` | 🔒 Teacher/Admin | Teacher dashboard stats |

---

## Support Tickets — `/api/v1/support`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/support` | 🔒 | Create support ticket |
| GET | `/support/my-tickets` | 🔒 | Get my tickets |
| GET | `/support/admin` | 🔒 Admin | Get all tickets |
| GET | `/support/admin/:id` | 🔒 Admin | Get single ticket |
| PUT | `/support/admin/:id/reply` | 🔒 Admin | Reply to ticket |

---

## Ratings — `/api/v1/ratings`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/lessons/:lessonId/ratings` | 🔒 | Rate a lesson |
| GET | `/lessons/:lessonId/ratings/me` | 🔒 | Get my rating for a lesson |
| GET | `/ratings/admin` | 🔒 Admin | Get all ratings |

---

## Progress Reports — `/api/v1/progress-reports`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/progress-reports` | 🔒 Teacher/Admin | Get all progress reports |
| POST | `/progress-reports` | 🔒 Teacher/Admin | Create progress report |

---

## Chat — `/api/v1/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/chat/message` | 🔒 | Send message (supports image upload) |
| GET | `/chat/history` | 🔒 | Get chat history |
| DELETE | `/chat/history` | 🔒 | Clear chat history |

---

## Reports — `/api/v1/reports`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/posts/:postId/reports` | 🔒 | Report a post |
| GET | `/posts/:postId/reports` | 🔒 Teacher/Admin | Get reports on a post |
| PATCH | `/reports/:id` | 🔒 Teacher/Admin | Update report status |

---

## Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | Public | Check server status |
