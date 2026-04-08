# API Contract: Levels

**Base Path**: `/api/v1/levels`

## GET /api/v1/levels

Get all levels sorted by levelOrder.

**Authentication**: Required
**Roles**: Any authenticated user

### Response — 200 OK

```json
{
  "status": "success",
  "results": 4,
  "data": {
    "data": [
      {
        "_id": "...",
        "title": "Basics",
        "description": "Letters, numbers, family signs",
        "levelOrder": 1
      }
    ]
  }
}
```

---

## GET /api/v1/levels/:id

Get a specific level with its lessons (virtual populate).

**Authentication**: Required

### Response — 200 OK

```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "...",
      "title": "Basics",
      "description": "...",
      "levelOrder": 1,
      "lessons": [ ... ]
    }
  }
}
```

---

## POST /api/v1/levels

Create a new level.

**Roles**: teacher, admin

### Request

```json
{
  "title": "Advanced Concepts",
  "description": "Complex sentence structures",
  "levelOrder": 3
}
```

### Response — 201 Created

---

## PATCH /api/v1/levels/:id

Update a level.

**Roles**: teacher, admin

---

## DELETE /api/v1/levels/:id

Delete a level.

**Roles**: admin

### Response — 204 No Content
