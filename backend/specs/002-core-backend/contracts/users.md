# API Contract: Users

**Base Path**: `/api/v1/users`
**Authentication**: All routes require authentication unless noted.

## GET /api/v1/users/me

Get current logged-in user's profile.

**Roles**: Any authenticated user

### Response — 200 OK

```json
{
  "status": "success",
  "data": {
    "data": {
      "_id": "...",
      "firstName": "Ahmed",
      "lastName": "Ali",
      "email": "ahmed@example.com",
      "role": "user",
      "phoneNum": "0551234567",
      "profilePicture": "default.jpg"
    }
  }
}
```

---

## PATCH /api/v1/users/updateMe

Update current user's profile (non-password fields).

**Roles**: Any authenticated user

### Request

```json
{
  "firstName": "Ahmed Updated",
  "email": "newemail@example.com"
}
```

### Response — 200 OK

```json
{
  "status": "success",
  "data": {
    "user": { ... }
  }
}
```

---

## DELETE /api/v1/users/deleteMe

Deactivate current user's account (soft delete).

**Roles**: Any authenticated user

### Response — 204 No Content

---

## GET /api/v1/users

Get all users.

**Roles**: admin

### Response — 200 OK

```json
{
  "status": "success",
  "results": 25,
  "data": {
    "data": [ ... ]
  }
}
```

Supports APIFeatures: filtering, sorting, field limiting, pagination.

---

## GET /api/v1/users/:id

Get a specific user.

**Roles**: admin

---

## PATCH /api/v1/users/:id

Update a user (admin).

**Roles**: admin

---

## DELETE /api/v1/users/:id

Delete a user (admin).

**Roles**: admin

### Response — 204 No Content
