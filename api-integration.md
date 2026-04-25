# Sout-Elyad — API Integration Document
> Flutter ↔ Backend (Node.js/Express + MongoDB)

---

## 1. Setup & Configuration

### Base URL
```dart
// mobile/lib/core/constants/env.dart
class Env {
  static const String apiBaseUrl = 'http://192.168.1.6:3004/api/v1';
  // Android emulator  → http://10.0.2.2:3004/api/v1
  // iOS emulator      → http://127.0.0.1:3004/api/v1
  // Real device       → http://<PC-IP>:3004/api/v1
  // Production        → https://your-domain.com/api/v1
}
```

### HTTP Client — Dio (Singleton)
```dart
// mobile/lib/core/api/api_client.dart
final apiClient = ApiClient().dio;   // shared instance used in all services
```

**Interceptor behavior:**
- Reads JWT from `FlutterSecureStorage` (key: `auth_token`) and attaches `Authorization: Bearer {token}` to every request.
- On **401** response → deletes `auth_token` + `auth_user` from secure storage.

### Response Envelope
All backend responses follow this shape:
```json
{ "status": "success", "data": { "data": <payload> } }
```
| Payload type | Flutter parse path |
|---|---|
| List | `res.data['data']['data'] as List` |
| Single object | `res.data['data']['data'] as Map` |
| Auth user | `res.data['data']['user']` |
| Quiz attempt | `res.data['data']['data']` |

### Error Handling
```dart
// mobile/lib/core/api/api_exception.dart
// All services wrap DioException → ApiException with Arabic message + statusCode
throw ApiException.fromDioException(e);
```

---

## 2. Authentication — `AuthService`
**File:** `mobile/lib/features/auth/data/auth_service.dart`

| Method | HTTP | Endpoint | Auth | Body |
|---|---|---|---|---|
| `login(email, password)` | POST | `/users/login` | ❌ | `{email, password}` |
| `signup(firstName, lastName, email, password, passwordConfirm)` | POST | `/users/signup` | ❌ | `{firstName, lastName, email, password, passwordConfirm}` |
| `forgotPassword(email)` | POST | `/users/forgotPassword` | ❌ | `{email}` |
| `resetPassword(token, password, passwordConfirm)` | PATCH | `/users/resetPassword/{token}` | ❌ | `{password, passwordConfirm}` |
| `updatePassword(currentPassword, password, passwordConfirm)` | PATCH | `/users/updateMyPassword` | ✅ | `{passwordCurrent, password, passwordConfirm}` |

**Response — login/signup:**
```json
{ "status": "success", "token": "jwt...", "data": { "user": { ...UserModel } } }
```
Token saved to `FlutterSecureStorage` key `auth_token`. User saved to key `auth_user`.

---

## 3. User Profile — `UserService`
**File:** `mobile/lib/features/profile/data/user_service.dart`

| Method | HTTP | Endpoint | Body |
|---|---|---|---|
| `updateMe(firstName, lastName, email)` | PATCH | `/users/updateMe` | JSON body |
| `updateMeWithPhoto(firstName, lastName, email, photoPath)` | PATCH | `/users/updateMe` | `FormData` multipart (field: `photo`) |
| `updatePassword(currentPassword, newPassword, confirmPassword)` | PATCH | `/users/updateMyPassword` | `{passwordCurrent, password, passwordConfirm}` |
| `getMyAttempts()` | GET | `/quiz-attempts/my-attempts` | — |

**`getMyAttempts` returns:**
```dart
class QuizAttemptSummary {
  String id, quizTitle;
  int score, totalMarks, percentage;
  bool passed;
  DateTime createdAt;
}
```

---

## 4. Levels & Lessons — `LevelsService`
**File:** `mobile/lib/features/lessons/data/lessons_service.dart`

| Method | HTTP | Endpoint | Auth | Notes |
|---|---|---|---|---|
| `getLevels()` | GET | `/levels` | ❌ | Returns `List<LevelModel>` |
| `getLevel(id)` | GET | `/levels/{id}` | ❌ | Returns `LevelModel` |
| `getLesson(lessonId)` | GET | `/lessons/{lessonId}` | ❌ | Returns `LessonModel` |
| `markLessonComplete(lessonId)` | POST | `/progress` | ✅ | Body: `{lessonId}` |
| `getMyProgress()` | GET | `/progress/my-progress` | ✅ | Returns `List<LessonProgressModel>` |

**LevelModel fields:** `id, title, description, levelOrder, lessonsCount, lessons[]`

**LessonModel fields:** `id, title, description, videoUrl, thumbnailUrl, duration, avgRating, numRatings, lessonOrder, levelId, levelTitle`

> `LessonModel.resolveUrl(url)` converts relative paths to full URL using `baseUrl`.

---

## 5. Quizzes — `QuizService`
**File:** `mobile/lib/features/quiz/data/quiz_service.dart`

| Method | HTTP | Endpoint | Auth | Notes |
|---|---|---|---|---|
| `getQuizByLesson(lessonId)` | GET | `/lessons/{lessonId}/quizzes` | ✅ | Returns `QuizModel?` (first or null) |
| `getQuiz(quizId)` | GET | `/quizzes/{quizId}` | ✅ | Returns `QuizModel` |
| `submitQuiz(quizId, answers)` | POST | `/quiz-attempts` | ✅ | Returns `QuizSubmitResult` |

**Submit body:**
```json
{
  "quizId": "abc123",
  "answers": [
    { "questionId": "q1", "selectedOptionId": "opt2" }
  ]
}
```

**`QuizSubmitResult`:**
```dart
class QuizSubmitResult {
  int score;       // marks earned
  int totalMarks;  // total possible marks
  bool passed;     // passed threshold?
}
```

**QuizModel → QuestionModel fields:**
```
QuizModel:    id, title, lessonId
QuestionModel: id, questionText, questionType (mcq|true-false|ai-practice),
               marks, options[]{id, text, isCorrect}, expectedSign, imageUrl
```

---

## 6. Community — `CommunityService`
**File:** `mobile/lib/features/community/data/community_service.dart`

| Method | HTTP | Endpoint | Notes |
|---|---|---|---|
| `getPosts()` | GET | `/posts` | Returns `List<PostModel>` |
| `createPost(content)` | POST | `/posts` | Body: `{content}` |
| `deletePost(postId)` | DELETE | `/posts/{postId}` | Ownership checked server-side |
| `toggleLike(postId)` | POST | `/posts/{postId}/likes` | Creates or deletes like |
| `getComments(postId)` | GET | `/posts/{postId}/comments` | Returns `List<CommentModel>` |
| `createComment(postId, content)` | POST | `/posts/{postId}/comments` | Body: `{content}` |
| `deleteComment(postId, commentId)` | DELETE | `/posts/{postId}/comments/{commentId}` | Ownership checked |

**PostModel fields:** `id, content, mediaUrl, status, userId, userName, userAvatar, likesCount, commentsCount, createdAt`

**CommentModel fields:** `id, content, postId, userId, userName, userAvatar, createdAt`

---

## 7. Notifications — `NotificationsService`
**File:** `mobile/lib/features/notifications/data/notifications_service.dart`

| Method | HTTP | Endpoint | Notes |
|---|---|---|---|
| `getMyNotifications()` | GET | `/notifications` | Returns `List<NotificationModel>` |
| `markAsRead(id)` | PATCH | `/notifications/{id}` | Body: `{read: true}` |

**NotificationModel fields:** `id, type (lesson|quiz|community|system|announcement), message, link, read, createdAt`

---

## 8. Ratings — `RatingsService`
**File:** `mobile/lib/features/lessons/data/ratings_service.dart`

| Method | HTTP | Endpoint | Auth | Notes |
|---|---|---|---|---|
| `addRating(lessonId, rating)` | POST | `/lessons/{lessonId}/ratings` | ✅ | Body: `{rating}` (1–5) |
| `getMyRating(lessonId)` | GET | `/lessons/{lessonId}/ratings/me` | ✅ | Returns `RatingModel?` |

**RatingModel fields:** `id, lessonId, userId, rating (1–5), createdAt`

---

## 9. AI Practice — `AIPracticeService`
**File:** `mobile/lib/features/quiz/data/ai_practice_service.dart`

| Method | HTTP | Endpoint | Auth | Notes |
|---|---|---|---|---|
| `evaluateSign(questionId, videoPath)` | POST | `/ai-practice/{questionId}` | ✅ | `FormData` multipart, field: `video`, max 50MB |
| `getMyResults(questionId)` | GET | `/ai-practice/{questionId}/my-results` | ✅ | Returns `List<AIPracticeResult>` |

**`AIPracticeResult` fields:**
```dart
class AIPracticeResult {
  String id, questionId;
  double accuracy;   // 0–100
  bool passed;
  String? feedback;
  DateTime createdAt;
}
```

---

## 10. Stats — `HomeService`
**File:** `mobile/lib/features/home/data/home_service.dart`

| Method | HTTP | Endpoint | Auth | Notes |
|---|---|---|---|---|
| `getStudentStats()` | GET | `/stats/student` | ✅ | Dashboard stats for current student |

**Response fields (example):**
```json
{
  "lessonsCompleted": 5,
  "totalLessons": 20,
  "quizzesPassed": 3,
  "totalQuizzes": 8,
  "averageScore": 75
}
```

---

## 11. Integration Status Matrix

| Feature | Backend Endpoints | Flutter Service | Status |
|---|---|---|---|
| Authentication | 5 | `AuthService` | ✅ Done |
| User Profile | 4 | `UserService` | ✅ Done |
| Levels & Lessons | 5 | `LevelsService` | ✅ Done |
| Lesson Progress (mark complete) | 1 | `LevelsService.markLessonComplete` | ✅ Done |
| Lesson Progress (get history) | 1 | `LevelsService.getMyProgress` | ✅ Done |
| Quizzes (view + submit) | 5 | `QuizService` | ✅ Done |
| Quiz Attempts (my history) | 1 | `UserService.getMyAttempts` | ✅ Done |
| Community Posts | 5 | `CommunityService` | ✅ Done |
| Comments | 3 | `CommunityService` | ✅ Done |
| Likes | 1 | `CommunityService` | ✅ Done |
| Notifications | 2 | `NotificationsService` | ✅ Done |
| Student Stats | 1 | `HomeService` | ✅ Done |
| Ratings | 2 | `RatingsService` | ✅ Done |
| AI Practice (video) | 2 | `AIPracticeService` | ✅ Done |
| Reports | 3 | — | ❌ Student app doesn't need |
| Teacher/Admin endpoints | 10+ | — | ❌ Admin-only (web dashboard) |

---

## 12. Quick Reference — All Endpoints Used by Flutter

```
POST   /users/login
POST   /users/signup
POST   /users/forgotPassword
PATCH  /users/resetPassword/:token
PATCH  /users/updateMyPassword
PATCH  /users/updateMe
GET    /users/me

GET    /levels
GET    /levels/:id
GET    /lessons/:id
GET    /levels/:levelId/lessons      (via LevelModel.lessons)

POST   /progress
GET    /progress/my-progress

GET    /lessons/:lessonId/quizzes
GET    /quizzes/:id
POST   /quiz-attempts
GET    /quiz-attempts/my-attempts

POST   /lessons/:lessonId/ratings
GET    /lessons/:lessonId/ratings/me

POST   /ai-practice/:questionId      (multipart video)
GET    /ai-practice/:questionId/my-results

GET    /posts
POST   /posts
DELETE /posts/:id
POST   /posts/:postId/likes
GET    /posts/:postId/comments
POST   /posts/:postId/comments
DELETE /posts/:postId/comments/:id

GET    /notifications
PATCH  /notifications/:id

GET    /stats/student
GET    /health
```
