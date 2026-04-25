# Sout El-Iyad — Student App API Guide

## Overview

- **Base URL:** `http://YOUR_SERVER_IP:3002/api/v1`
- **Auth:** JWT Bearer Token — add to every protected request:
  ```
  Authorization: Bearer <token>
  ```
- **Content-Type:** `application/json` (except file uploads → `multipart/form-data`)
- **All responses follow this shape:**
  ```json
  { "status": "success", "data": { "data": { ... } } }
  { "status": "success", "results": 10, "data": { "data": [ ... ] } }
  { "status": "fail", "message": "..." }
  ```

---

## Roles

| Role | Who |
|------|-----|
| `user` | Student (default after signup) |
| `teacher` | Teacher |
| `admin` | Admin |

Student app only deals with `user` role.

---

## 1. Authentication

### Sign Up
```
POST /users/signup
```
**Body:**
```json
{
  "firstName": "أحمد",
  "lastName": "محمد",
  "email": "ahmed@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```
**Response:** returns `token` + `data.user`

---

### Login
```
POST /users/login
```
**Body:**
```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```
**Response:** returns `token` — save it locally and attach to all future requests.

---

### Logout
```
GET /users/logout
```

---

### Forgot Password
```
POST /users/forgotPassword
```
**Body:** `{ "email": "ahmed@example.com" }`
Sends reset token to email.

---

### Reset Password
```
PATCH /users/resetPassword/:token
```
**Body:** `{ "password": "newpass123", "passwordConfirm": "newpass123" }`

---

### Get My Profile
```
GET /users/me
🔒 Protected
```
Returns the logged-in user's data.

---

### Update My Profile
```
PATCH /users/updateMe
🔒 Protected
Content-Type: multipart/form-data
```
**Fields (all optional):**
- `firstName`, `lastName`, `email`
- `profilePicture` — image file

---

### Change Password
```
PATCH /users/updateMyPassword
🔒 Protected
```
**Body:**
```json
{
  "passwordCurrent": "oldpass",
  "password": "newpass123",
  "passwordConfirm": "newpass123"
}
```

---

### Delete My Account
```
DELETE /users/deleteMe
🔒 Protected
```

---

## 2. Levels (المستويات)

> Public — no auth required

### Get All Levels
```
GET /levels?sort=createdAt
```
**Response:**
```json
{
  "data": {
    "data": [
      { "_id": "...", "title": "المستوى الأول", "description": "...", "order": 1 }
    ]
  }
}
```

### Get Single Level
```
GET /levels/:id
```

---

## 3. Lessons (الدروس)

> GET routes are public — no auth required

### Get All Lessons
```
GET /lessons?sort=createdAt&limit=10&page=1
GET /lessons?levelId=LEVEL_ID&sort=createdAt
```
**Response per lesson:**
```json
{
  "_id": "...",
  "title": "الحروف العربية",
  "description": "تعلم إشارات...",
  "videoUrl": "http://.../uploads/lessons/videos/...",
  "thumbnailUrl": "http://.../uploads/lessons/images/...",
  "duration": "8:24",
  "avgRating": 4.8,
  "levelId": { "_id": "...", "title": "المستوى الأول" }
}
```

### Get Lessons By Level
```
GET /levels/:levelId/lessons?sort=createdAt
```

### Get Single Lesson (with quizzes)
```
GET /lessons/:id
```
Response includes `quizzes` array populated.

---

## 4. Lesson Progress (تقدم الطالب)

> 🔒 All routes protected

### Mark Lesson as Complete
```
POST /progress
```
**Body:** `{ "lessonId": "LESSON_ID" }`

---

### Get My Progress
```
GET /progress/my-progress
```
Returns array of completed lesson records:
```json
[
  {
    "_id": "...",
    "lessonId": { "_id": "...", "title": "..." },
    "userId": "...",
    "completedAt": "2026-01-15T..."
  }
]
```

---

## 5. Quizzes (الاختبارات)

> 🔒 All routes protected

### Get Quizzes for a Lesson
```
GET /lessons/:lessonId/quizzes
```

### Get Single Quiz (with questions)
```
GET /quizzes/:id
```

### Get Questions for a Quiz
```
GET /quizzes/:quizId/questions
```
**Response per question:**
```json
{
  "_id": "...",
  "questionText": "ما هي إشارة ...",
  "options": ["أ", "ب", "ج", "د"],
  "videoUrl": "...",
  "imageUrl": "..."
}
```

---

## 6. Quiz Attempts (تسليم الاختبار)

> 🔒 All routes protected

### Submit Quiz
```
POST /quiz-attempts
```
**Body:**
```json
{
  "quizId": "QUIZ_ID",
  "answers": [
    { "questionId": "Q_ID_1", "selectedOption": "أ" },
    { "questionId": "Q_ID_2", "selectedOption": "ج" }
  ]
}
```
**Response:**
```json
{
  "data": {
    "data": {
      "score": 80,
      "passed": true,
      "correctAnswers": 4,
      "totalQuestions": 5,
      "answers": [ ... ]
    }
  }
}
```

### Get My Attempts
```
GET /quiz-attempts/my-attempts
```

### Get Single Attempt
```
GET /quiz-attempts/:id
```

---

## 7. AI Practice (تدريب بالذكاء الاصطناعي)

> 🔒 Protected | Upload video of student performing sign language

### Submit Practice Video
```
POST /ai-practice/:questionId
Content-Type: multipart/form-data
```
**Field:** `video` — video file (mp4/webm, max 50MB)

**Response:**
```json
{
  "data": {
    "data": {
      "isCorrect": true,
      "confidence": 0.92,
      "feedback": "أحسنت! الإشارة صحيحة"
    }
  }
}
```

### Get My Practice Results for a Question
```
GET /ai-practice/:questionId/my-results
```

---

## 8. Ratings (تقييم الدروس)

> 🔒 Protected

### Rate a Lesson (1–5 stars)
```
POST /lessons/:lessonId/ratings
```
**Body:** `{ "rating": 5 }`

### Get My Rating for a Lesson
```
GET /lessons/:lessonId/ratings/me
```

---

## 9. Community — Posts (المجتمع)

> 🔒 All routes protected

### Get All Posts
```
GET /posts
```
**Response per post:**
```json
{
  "_id": "...",
  "content": "نص المنشور",
  "userId": { "_id": "...", "firstName": "أحمد", "profilePicture": "..." },
  "likesCount": 12,
  "createdAt": "2026-01-15T..."
}
```

### Create Post
```
POST /posts
```
**Body:** `{ "content": "نص المنشور" }`

### Update Post (owner only)
```
PATCH /posts/:id
```
**Body:** `{ "content": "نص معدل" }`

### Delete Post (owner only)
```
DELETE /posts/:id
```

---

## 10. Community — Comments (التعليقات)

> 🔒 Protected | Nested under posts

### Get Comments for a Post
```
GET /posts/:postId/comments
```

### Add Comment
```
POST /posts/:postId/comments
```
**Body:** `{ "content": "تعليقي هنا" }`

### Delete Comment (owner only)
```
DELETE /posts/:postId/comments/:id
```

---

## 11. Likes (الإعجابات)

> 🔒 Protected | Toggle — same endpoint adds or removes like

### Toggle Like on Post
```
POST /posts/:postId/likes
```
**Response:**
```json
{ "data": { "data": { "liked": true } } }
```

---

## 12. Notifications (الإشعارات)

> 🔒 Protected

### Get My Notifications
```
GET /notifications
```

### Get Unread Count
```
GET /notifications/unread-count
```

### Mark Notification as Read
```
PATCH /notifications/:id
```

---

## 13. Support Tickets (الدعم الفني)

> 🔒 Protected

### Create Support Ticket
```
POST /support-tickets
```
**Body:**
```json
{
  "subject": "مشكلة في تشغيل الفيديو",
  "message": "الفيديو لا يعمل في الدرس الثالث"
}
```

### Get My Tickets
```
GET /support-tickets/my-tickets
```

---

## Query Parameters (Filtering & Pagination)

All list endpoints support:

| Parameter | Example | Description |
|-----------|---------|-------------|
| `sort` | `sort=createdAt` | Sort ascending by field |
| `sort` | `sort=-createdAt` | Sort descending (default) |
| `limit` | `limit=10` | Items per page |
| `page` | `page=2` | Page number |
| `fields` | `fields=title,description` | Select specific fields |

---

## Complete Student Flow

```
1. SIGNUP / LOGIN
        ↓
   Save token locally
        ↓
2. GET /levels          → show level tabs
        ↓
3. GET /lessons?levelId=X&sort=createdAt
                        → show lesson cards
        ↓
4. GET /lessons/:id     → lesson detail (includes quizzes array)
        ↓
5. Student watches video
        ↓
6. POST /progress       → mark lesson complete
        ↓
7. GET /lessons/:lessonId/quizzes
                        → get quiz for this lesson
        ↓
8. GET /quizzes/:quizId/questions
                        → get questions
        ↓
9. (Optional) POST /ai-practice/:questionId
                        → student records sign, gets AI feedback
        ↓
10. POST /quiz-attempts → submit answers, get score
        ↓
11. POST /lessons/:lessonId/ratings
                        → student rates the lesson
        ↓
12. GET /progress/my-progress
                        → show overall progress on home screen
```

---

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request / validation error |
| 401 | Not logged in / token expired |
| 403 | Not authorized (wrong role or permission) |
| 404 | Resource not found |
| 500 | Server error |

**Token expired → re-login and get new token.**
