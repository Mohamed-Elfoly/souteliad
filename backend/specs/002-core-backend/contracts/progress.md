# API Contract: Lesson Progress

**Base Path**: `/api/v1/progress`

## POST /api/v1/progress

Mark a lesson as complete for the current user.

**Authentication**: Required
**Roles**: user

### Request

```json
{
  "lessonId": "..."
}
```

### Response — 201 Created

```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "...",
      "userId": "...",
      "lessonId": "...",
      "completedAt": "2026-02-07T12:00:00.000Z"
    }
  }
}
```

### Error — 400 Bad Request (duplicate)

```json
{
  "status": "fail",
  "message": "You have already completed this lesson"
}
```

---

## GET /api/v1/progress/my-progress

Get current user's completed lessons.

**Authentication**: Required

### Response — 200 OK

```json
{
  "status": "success",
  "results": 5,
  "data": {
    "data": [
      {
        "_id": "...",
        "userId": "...",
        "lessonId": { "_id": "...", "title": "Letters A-D" },
        "completedAt": "..."
      }
    ]
  }
}
```

---

## GET /api/v1/progress/user/:userId

Get a specific user's progress.

**Authentication**: Required
**Roles**: teacher, admin

### Response — 200 OK

Same format as my-progress but for the specified user.
