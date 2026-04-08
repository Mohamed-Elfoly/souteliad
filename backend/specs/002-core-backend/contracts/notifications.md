# API Contract: Notifications

**Base Path**: `/api/v1/notifications`

## GET /api/v1/notifications

Get current user's notifications (sorted by newest, paginated).

**Authentication**: Required

### Response — 200 OK

```json
{
  "status": "success",
  "results": 15,
  "data": {
    "data": [
      {
        "_id": "...",
        "type": "lesson",
        "message": "New lesson available: Arabic Letters E-H",
        "link": "/api/v1/lessons/...",
        "read": false,
        "createdAt": "2026-02-07T12:00:00.000Z"
      }
    ]
  }
}
```

---

## GET /api/v1/notifications/unread-count

Get count of unread notifications.

**Authentication**: Required

### Response — 200 OK

```json
{
  "status": "success",
  "data": {
    "unreadCount": 5
  }
}
```

---

## PATCH /api/v1/notifications/:id

Mark a notification as read.

**Authentication**: Required (owner only)

### Request

```json
{
  "read": true
}
```

### Response — 200 OK

```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "...",
      "read": true
    }
  }
}
```

---

## POST /api/v1/notifications

Create a notification (for admin/system use).

**Roles**: admin, teacher

```json
{
  "type": "announcement",
  "message": "Platform maintenance scheduled for tonight",
  "userId": "..."
}
```
