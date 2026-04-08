# API Contract: Health Check

**Base Path**: `/api/v1`

## GET /api/v1/health

Returns the operational status of the backend system.

**Authentication**: None (public endpoint)

### Request

No parameters, no body.

```
GET /api/v1/health HTTP/1.1
Host: localhost:3000
```

### Response — 200 OK

```json
{
  "status": "success",
  "data": {
    "status": "healthy",
    "environment": "development",
    "timestamp": "2026-02-07T12:00:00.000Z"
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| status | String | Always `"success"` for 200 response |
| data.status | String | `"healthy"` when server and DB are operational |
| data.environment | String | Current `NODE_ENV` value |
| data.timestamp | String | ISO 8601 timestamp of the response |

### Error Responses

| Status | Condition | Body |
|--------|-----------|------|
| 429 | Rate limit exceeded | `{ "status": "fail", "message": "Too many requests from this IP, please try again later" }` |
| 500 | Server error | `{ "status": "error", "message": "Something went wrong" }` |

## Catch-All: Unmatched Routes

Any request to a path not defined by a router returns 404.

### Response — 404 Not Found

```json
{
  "status": "fail",
  "message": "Can't find /api/v1/nonexistent on this server!"
}
```

## Standard Error Envelope

All errors across the API follow this format:

### Development Mode

```json
{
  "status": "fail",
  "error": { ... },
  "message": "Descriptive error message",
  "stack": "Error: ...\n    at ..."
}
```

### Production Mode

```json
{
  "status": "fail",
  "message": "Descriptive error message"
}
```

For non-operational (programming) errors in production:

```json
{
  "status": "error",
  "message": "Something went very wrong!"
}
```
