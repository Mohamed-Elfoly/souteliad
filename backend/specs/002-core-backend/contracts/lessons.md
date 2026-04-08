# API Contract: Lessons

**Base Path**: `/api/v1/lessons` and `/api/v1/levels/:levelId/lessons`

## GET /api/v1/lessons

Get all lessons. Supports filtering by levelId via query or nested route.

**Authentication**: Required

### Response — 200 OK

```json
{
  "status": "success",
  "results": 10,
  "data": {
    "data": [
      {
        "_id": "...",
        "title": "Arabic Letters A-D",
        "description": "Learn basic Arabic letter signs",
        "videoUrl": "https://...",
        "thumbnailUrl": "https://...",
        "lessonOrder": 1,
        "levelId": "...",
        "teacherId": "..."
      }
    ]
  }
}
```

---

## GET /api/v1/levels/:levelId/lessons

Get all lessons for a specific level, sorted by lessonOrder.

**Authentication**: Required

---

## GET /api/v1/lessons/:id

Get a specific lesson with its quizzes (virtual populate).

**Authentication**: Required

---

## POST /api/v1/lessons

Create a new lesson. If accessed via nested route, levelId is auto-set.

**Roles**: teacher, admin

### Request

```json
{
  "title": "Arabic Letters A-D",
  "description": "Learn basic Arabic letter signs",
  "videoUrl": "https://storage.example.com/lesson1.mp4",
  "thumbnailUrl": "https://storage.example.com/thumb1.jpg",
  "lessonOrder": 1,
  "levelId": "..."
}
```

### Response — 201 Created

---

## PATCH /api/v1/lessons/:id

Update a lesson.

**Roles**: teacher, admin

---

## DELETE /api/v1/lessons/:id

Delete a lesson.

**Roles**: teacher, admin

### Response — 204 No Content
