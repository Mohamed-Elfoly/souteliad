# API Contract: Community (Posts, Comments, Likes, Reports)

**Base Paths**:
- `/api/v1/posts`
- `/api/v1/posts/:postId/comments`
- `/api/v1/posts/:postId/likes`
- `/api/v1/posts/:postId/reports`

## Posts

### GET /api/v1/posts

Get all active community posts (paginated, sorted by newest).

**Authentication**: Required

### Response — 200 OK

```json
{
  "status": "success",
  "results": 20,
  "data": {
    "data": [
      {
        "_id": "...",
        "content": "Just learned the sign for hello!",
        "mediaUrl": null,
        "status": "active",
        "userId": { "_id": "...", "firstName": "Ahmed", "profilePicture": "..." },
        "createdAt": "..."
      }
    ]
  }
}
```

### POST /api/v1/posts

Create a new post.

**Roles**: Any authenticated user

```json
{
  "content": "Just learned the sign for hello!",
  "mediaUrl": "https://..."
}
```

### PATCH /api/v1/posts/:id

Update own post (content/media only). Admins/teachers can update status.

### DELETE /api/v1/posts/:id

Delete own post. Admins can delete any post.

---

## Comments

### GET /api/v1/posts/:postId/comments

Get all comments for a post.

### POST /api/v1/posts/:postId/comments

Add a comment to a post.

```json
{
  "content": "Great progress!"
}
```

### DELETE /api/v1/comments/:id

Delete own comment. Admins/teachers can delete any.

---

## Likes

### POST /api/v1/posts/:postId/likes

Toggle like on a post. Creates like if not exists, removes if exists.

### Response — 200 OK (liked)

```json
{
  "status": "success",
  "data": { "liked": true }
}
```

### Response — 200 OK (unliked)

```json
{
  "status": "success",
  "data": { "liked": false }
}
```

---

## Reports

### POST /api/v1/posts/:postId/reports

Report a post.

**Roles**: Any authenticated user

```json
{
  "reason": "Inappropriate content"
}
```

### GET /api/v1/reports

Get all reports (for moderation).

**Roles**: teacher, admin

### PATCH /api/v1/reports/:id

Update report status.

**Roles**: teacher, admin

```json
{
  "status": "reviewed"
}
```
