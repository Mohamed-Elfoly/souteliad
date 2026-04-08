# API Contract: Authentication

**Base Path**: `/api/v1/users`

## POST /api/v1/users/signup

Register a new user account.

### Request

```json
{
  "firstName": "Ahmed",
  "lastName": "Ali",
  "email": "ahmed@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "phoneNum": "0551234567"
}
```

### Response — 201 Created

```json
{
  "status": "success",
  "token": "eyJhbGciOi...",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "Ahmed",
      "lastName": "Ali",
      "email": "ahmed@example.com",
      "role": "user"
    }
  }
}
```

Sets `jwt` HttpOnly cookie.

---

## POST /api/v1/users/login

Authenticate with email and password.

### Request

```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```

### Response — 200 OK

```json
{
  "status": "success",
  "token": "eyJhbGciOi...",
  "data": {
    "user": {
      "_id": "...",
      "firstName": "Ahmed",
      "lastName": "Ali",
      "email": "ahmed@example.com",
      "role": "user"
    }
  }
}
```

### Error — 401 Unauthorized

```json
{
  "status": "fail",
  "message": "Incorrect email or password"
}
```

---

## GET /api/v1/users/logout

Clear authentication cookie.

### Response — 200 OK

```json
{
  "status": "success"
}
```

---

## POST /api/v1/users/forgotPassword

Request password reset token.

### Request

```json
{
  "email": "ahmed@example.com"
}
```

### Response — 200 OK

```json
{
  "status": "success",
  "message": "Token sent to email!"
}
```

(In development: reset URL logged to console)

---

## PATCH /api/v1/users/resetPassword/:token

Reset password using token from email.

### Request

```json
{
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

### Response — 200 OK

```json
{
  "status": "success",
  "token": "eyJhbGciOi..."
}
```

---

## PATCH /api/v1/users/updateMyPassword

Change password (authenticated).

**Authentication**: Required (Bearer token)

### Request

```json
{
  "passwordCurrent": "password123",
  "password": "newpassword123",
  "passwordConfirm": "newpassword123"
}
```

### Response — 200 OK

```json
{
  "status": "success",
  "token": "eyJhbGciOi..."
}
```
