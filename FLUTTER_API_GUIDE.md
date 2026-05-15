# Sout Elyad — Flutter API Integration Guide

دليل الـ API endpoints للفلاتر — يغطي **Chat**, **Lessons**, و **Reset Password**.

---

## Base Configuration

```
Base URL:        http://YOUR_PC_IP:3002/api/v1
Local dev:       http://10.0.2.2:3002/api/v1     (Android emulator)
                 http://127.0.0.1:3002/api/v1    (iOS simulator)
                 http://192.168.1.6:3002/api/v1  (Physical device — your PC's IP)
Production:      https://souteliad-production.up.railway.app/api/v1
```

### Authentication

كل الـ endpoints المحمية تحتاج JWT في الـ header:

```
Authorization: Bearer <jwt_token>
```

يتم استرجاع الـ token من `/users/login` أو `/users/signup`.

---

## 1️⃣ Reset Password Flow (3 Steps)

دي العملية كاملة لإعادة تعيين كلمة المرور بـ OTP عبر الإيميل.

### Step 1 — Request OTP

```http
POST /users/forgotPassword
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "OTP sent to email!"
}
```

**Errors:**
- `404` — البريد غير مسجل
- `500` — مشكلة في إرسال الإيميل

> الـ OTP عبارة عن 6 أرقام يصل عبر الإيميل خلال ثوانٍ. صالح لـ **10 دقائق فقط**.

---

### Step 2 — Verify OTP

```http
POST /users/verifyOtp
Content-Type: application/json

{
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "OTP is valid"
}
```

**Errors:**
- `400` — الرمز غير صحيح أو انتهت صلاحيته

> هذه الخطوة للتحقق فقط — لا تستهلك الـ OTP. الـ OTP يُستهلك في الخطوة التالية.

---

### Step 3 — Reset Password

```http
PATCH /users/resetPassword/{otp}
Content-Type: application/json

{
  "password": "NewPassword123!",
  "passwordConfirm": "NewPassword123!"
}
```

> ⚠️ ضع الـ OTP في الـ URL كـ path parameter (مثال: `/users/resetPassword/123456`)

**Password requirements:**
- 8 أحرف على الأقل
- حرف كبير واحد على الأقل
- حرف صغير واحد على الأقل
- رقم واحد على الأقل
- رمز خاص واحد على الأقل

**Response (200):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "...",
      "lastName": "...",
      "email": "...",
      "role": "user"
    }
  }
}
```

> ✅ المستخدم يتم تسجيله تلقائياً بعد إعادة تعيين كلمة المرور (يستلم JWT جديد).

**Errors:**
- `400` — الرمز غير صحيح أو انتهت صلاحيته
- `400` — كلمة المرور لا تستوفي الشروط

---

### Flutter Example — Full Reset Flow

```dart
// Step 1
final res1 = await http.post(
  Uri.parse('$baseUrl/users/forgotPassword'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({'email': email}),
);

// Step 2 — after user enters OTP
final res2 = await http.post(
  Uri.parse('$baseUrl/users/verifyOtp'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({'otp': otp}),
);

// Step 3 — new password
final res3 = await http.patch(
  Uri.parse('$baseUrl/users/resetPassword/$otp'),
  headers: {'Content-Type': 'application/json'},
  body: jsonEncode({
    'password': newPassword,
    'passwordConfirm': newPassword,
  }),
);

final token = jsonDecode(res3.body)['token'];
// Save token to secure storage
```

---

## 2️⃣ Lessons API

### Get All Lessons

```http
GET /lessons
GET /lessons?limit=20
GET /lessons?levelId=507f1f77bcf86cd799439021
```

**Response (200):**
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439031",
        "title": "الحروف و الأرقام",
        "description": "...",
        "videoUrl": "https://drive.google.com/file/d/.../view",
        "thumbnailUrl": "https://res.cloudinary.com/...",
        "duration": "12",
        "avgRating": 4.5,
        "numRatings": 23,
        "levelId": { "_id": "...", "title": "الأول", "levelOrder": 1 },
        "teacherId": { "_id": "...", "firstName": "...", "lastName": "..." },
        "createdAt": "2026-01-01T..."
      }
    ]
  }
}
```

---

### Get Single Lesson

```http
GET /lessons/{lessonId}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "...",
      "title": "...",
      "description": "...",
      "videoUrl": "...",
      "thumbnailUrl": "...",
      "duration": "12",
      "avgRating": 4.5,
      "numRatings": 23,
      "levelId": { ... },
      "teacherId": { ... }
    }
  }
}
```

---

### Get Lessons for a Level

```http
GET /levels/{levelId}/lessons
```

**Response (200):** نفس شكل `GET /lessons`

---

### Get Quizzes for a Lesson

```http
GET /lessons/{lessonId}/quizzes
```

**Response (200):**
```json
{
  "status": "success",
  "results": 1,
  "data": {
    "data": [
      {
        "_id": "507f1f77bcf86cd799439051",
        "title": "اختبار الحروف العربية",
        "lessonId": "...",
        "teacherId": "..."
      }
    ]
  }
}
```

---

### Get Questions for a Quiz

```http
GET /quizzes/{quizId}/questions
```

**Response (200):**
```json
{
  "status": "success",
  "results": 4,
  "data": {
    "data": [
      {
        "_id": "...",
        "questionText": "ما إشارة حرف الألف؟",
        "questionType": "mcq",
        "marks": 1,
        "options": [
          { "_id": "...", "text": "...", "isCorrect": true },
          { "_id": "...", "text": "...", "isCorrect": false }
        ],
        "imageUrl": "..."
      },
      {
        "_id": "...",
        "questionText": "قم بأداء إشارة حرف الألف",
        "questionType": "ai-practice",
        "marks": 5,
        "expectedSign": "أ",
        "expectedType": "letter",
        "options": []
      }
    ]
  }
}
```

> **Question types:** `mcq`, `true-false`, `ai-practice`
>
> **AI Practice types** (`expectedType`): `letter`, `number`, `word`, `sentence`

---

### Submit Quiz Attempt

```http
POST /quiz-attempts
Authorization: Bearer <token>
Content-Type: application/json

{
  "quizId": "507f1f77bcf86cd799439051",
  "answers": [
    { "questionId": "...", "selectedOptionId": 0 },
    { "questionId": "...", "selectedOptionId": 1 }
  ]
}
```

> ⚠️ AI practice questions يتم إرسالها بشكل منفصل (انظر القسم التالي). أرسل فقط إجابات MCQ/True-False هنا.

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "...",
      "userId": "...",
      "quizId": "...",
      "score": 8,
      "totalMarks": 10,
      "passed": true,
      "createdAt": "..."
    }
  }
}
```

---

### AI Practice — Submit Sign Video

عشان أسئلة `ai-practice`: يبعت فيديو الإشارة قبل ما يخلص الـ quiz.

```http
POST /ai-practice/{questionId}
Authorization: Bearer <token>
Content-Type: multipart/form-data

video: <file (5-second mp4/webm)>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "resultId": "...",
    "questionId": "...",
    "questionText": "قم بأداء إشارة حرف الألف",
    "expectedSign": "أ",
    "expectedType": "letter",
    "detected": "أ",
    "accuracy": 85,
    "passed": true,
    "feedback": "أحسنت! تم التعرف على الحرف \"أ\" بنجاح.",
    "source": "swinv2",
    "top5": [
      { "sign_arabic": "أ", "sign_english": "aleff", "confidence": 0.85 }
    ]
  }
}
```

**Flow:**
1. عرض السؤال للطالب
2. تسجيل فيديو 5 ثواني بالكاميرا
3. ابعث الفيديو لـ `POST /ai-practice/{questionId}`
4. عرض الـ feedback للطالب
5. لما يخلص كل الأسئلة، ابعث `POST /quiz-attempts` بإجابات الـ MCQ فقط — الـ backend بيجيب نتائج الـ AI من DB تلقائياً

---

### Lesson Progress

```http
POST /progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "lessonId": "507f1f77bcf86cd799439031",
  "completed": true
}
```

```http
GET /progress/my-progress
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "lessonId": "...",
        "completed": true,
        "completedAt": "..."
      }
    ]
  }
}
```

---

### Rate a Lesson

```http
POST /lessons/{lessonId}/ratings
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5
}
```

```http
GET /lessons/{lessonId}/ratings/me
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "data": { "rating": 5 }
}
```

---

### Video URL Formats Supported

في `videoUrl`، Flutter لازم يتعامل مع التنسيقات دي:

| Format | Example |
|---|---|
| YouTube | `https://www.youtube.com/watch?v=XXX` |
| YouTube short | `https://youtu.be/XXX` |
| Google Drive | `https://drive.google.com/file/d/XXX/view` |
| Direct file | `https://example.com/video.mp4` |

**Embed conversion (in app):**
```dart
String? getEmbedUrl(String url) {
  // YouTube
  final yt = RegExp(r'(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)').firstMatch(url);
  if (yt != null) return 'https://www.youtube.com/embed/${yt.group(1)}';

  // Google Drive
  final drive = RegExp(r'drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)').firstMatch(url);
  if (drive != null) return 'https://drive.google.com/file/d/${drive.group(1)}/preview';

  return null; // direct file
}
```

**Thumbnail derivation:**
```dart
String? thumbnailFromVideoUrl(String url) {
  final yt = RegExp(r'(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)').firstMatch(url);
  if (yt != null) return 'https://i.ytimg.com/vi/${yt.group(1)}/hqdefault.jpg';

  final drive = RegExp(r'drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)').firstMatch(url);
  if (drive != null) return 'https://drive.google.com/thumbnail?id=${drive.group(1)}&sz=w800';

  return null;
}
```

---

## 3️⃣ Chat API

نظام محادثات متعددة (multi-conversation) مع دعم نص + صور + فيديو.

### Get All Conversations

```http
GET /chat/conversations
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "conversations": [
      {
        "_id": "...",
        "user": "...",
        "title": "كيف أتعلم الإشارة؟",
        "lastMessage": "بسهولة، ابدأ بالحروف الأبجدية...",
        "createdAt": "...",
        "updatedAt": "..."
      }
    ]
  }
}
```

---

### Create New Conversation

```http
POST /chat/conversations
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "محادثة جديدة"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "conversation": {
      "_id": "...",
      "title": "محادثة جديدة",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

> العنوان اختياري — لو محطتش حاجة هياخد العنوان من أول رسالة تلقائياً.

---

### Get Conversation History

```http
GET /chat/conversations/{conversationId}/history
GET /chat/conversations/{conversationId}/history?limit=50
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "messages": [
      {
        "_id": "...",
        "conversationId": "...",
        "role": "user",
        "content": "ازاي أتعلم لغة الإشارة؟",
        "imageUrl": null,
        "createdAt": "..."
      },
      {
        "_id": "...",
        "conversationId": "...",
        "role": "assistant",
        "content": "أهلاً! يمكنك البدء بـ...",
        "createdAt": "..."
      }
    ]
  }
}
```

> الرسائل مرتبة من الأقدم للأحدث.

---

### Send Message (Text / Image / Video)

```http
POST /chat/conversations/{conversationId}/message
Authorization: Bearer <token>
Content-Type: multipart/form-data

message: "ما هذه الإشارة؟"           (optional text)
image:   <file>                       (optional — JPEG/PNG, max 25MB)
video:   <file>                       (optional — WebM/MP4, max 25MB, max 5 sec recommended)
```

> ✅ على الأقل واحد من (message, image, video) لازم يكون موجود.
>
> ✅ نوع الـ AI:
> - **Text/Image** → Gemini 2.5 Flash (with Groq fallback)
> - **Video** → Gemini 2.5 Flash multimodal (يحلل الإشارة في الفيديو)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "message": "هذه إشارة حرف الألف (أ). تُؤدى بقبضة مغلقة والإبهام للأعلى...",
    "messageId": "..."
  }
}
```

**Errors:**
- `400` — لا توجد رسالة/صورة/فيديو
- `404` — المحادثة غير موجودة
- `500` — فشل في تحليل الفيديو

---

### Clear Conversation History

```http
DELETE /chat/conversations/{conversationId}/history
Authorization: Bearer <token>
```

يمسح كل الرسائل لكن يبقي على المحادثة نفسها.

**Response (204):** No content

---

### Delete Conversation

```http
DELETE /chat/conversations/{id}
Authorization: Bearer <token>
```

يمسح المحادثة وكل رسائلها.

**Response (204):** No content

---

### Flutter Example — Send Video Message

```dart
final request = http.MultipartRequest(
  'POST',
  Uri.parse('$baseUrl/chat/conversations/$conversationId/message'),
)
  ..headers['Authorization'] = 'Bearer $token'
  ..files.add(await http.MultipartFile.fromPath(
    'video',
    videoFile.path,
    contentType: MediaType('video', 'webm'),
  ))
  ..fields['message'] = 'ما هذه الإشارة؟';

final streamed = await request.send();
final response = await http.Response.fromStream(streamed);
final data = jsonDecode(response.body)['data'];
print(data['message']); // AI response
```

---

## 4️⃣ Common Error Format

كل الأخطاء بتيجي بالشكل ده:

```json
{
  "status": "fail",       // 4xx errors
  "message": "البريد غير صحيح"
}
```

```json
{
  "status": "error",      // 5xx errors
  "message": "حدث خطأ ما"
}
```

**HTTP Status Codes:**
- `200` — OK
- `201` — Created
- `204` — No Content (delete success)
- `400` — Bad Request (validation error)
- `401` — Unauthorized (missing/invalid token)
- `403` — Forbidden (no permission)
- `404` — Not Found
- `500` — Server Error

---

## 5️⃣ Recommended Flutter Dependencies

```yaml
dependencies:
  http: ^1.1.0                    # API calls
  flutter_secure_storage: ^9.0.0  # Store JWT
  camera: ^0.10.5                 # Record AI quiz/chat videos
  video_player: ^2.8.0            # Play lesson videos
  webview_flutter: ^4.4.0         # Play YouTube/Drive embeds
  image_picker: ^1.0.4            # Pick images for chat
  cached_network_image: ^3.3.0    # Cache lesson thumbnails
```

---

## 6️⃣ Quick Reference Table

| Feature | Method | Endpoint | Auth |
|---|---|---|---|
| **Reset Password** | | | |
| Request OTP | POST | `/users/forgotPassword` | No |
| Verify OTP | POST | `/users/verifyOtp` | No |
| Reset Password | PATCH | `/users/resetPassword/{otp}` | No |
| **Lessons** | | | |
| Get all lessons | GET | `/lessons` | No |
| Get lesson | GET | `/lessons/{id}` | No |
| Lessons by level | GET | `/levels/{levelId}/lessons` | No |
| Quizzes by lesson | GET | `/lessons/{lessonId}/quizzes` | No |
| Questions by quiz | GET | `/quizzes/{quizId}/questions` | No |
| Submit quiz | POST | `/quiz-attempts` | Yes |
| Submit AI sign video | POST | `/ai-practice/{questionId}` | Yes |
| Save progress | POST | `/progress` | Yes |
| My progress | GET | `/progress/my-progress` | Yes |
| Rate lesson | POST | `/lessons/{lessonId}/ratings` | Yes |
| My rating | GET | `/lessons/{lessonId}/ratings/me` | Yes |
| **Chat** | | | |
| List conversations | GET | `/chat/conversations` | Yes |
| New conversation | POST | `/chat/conversations` | Yes |
| Get history | GET | `/chat/conversations/{id}/history` | Yes |
| Send message | POST | `/chat/conversations/{id}/message` | Yes |
| Clear history | DELETE | `/chat/conversations/{id}/history` | Yes |
| Delete conversation | DELETE | `/chat/conversations/{id}` | Yes |
