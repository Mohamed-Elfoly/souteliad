# API Contract: Quizzes, Questions & Attempts

**Base Paths**:
- `/api/v1/quizzes` and `/api/v1/lessons/:lessonId/quizzes`
- `/api/v1/questions` and `/api/v1/quizzes/:quizId/questions`
- `/api/v1/quiz-attempts`

## Quizzes

### GET /api/v1/quizzes

Get all quizzes. Supports filtering by lessonId.

**Authentication**: Required

### GET /api/v1/lessons/:lessonId/quizzes

Get quizzes for a specific lesson.

### GET /api/v1/quizzes/:id

Get a specific quiz with its questions (virtual populate).
**Note**: Correct answers (`isCorrect`) are hidden for non-teacher roles.

### POST /api/v1/quizzes

Create a quiz linked to a lesson.

**Roles**: teacher, admin

```json
{
  "title": "Letters A-D Quiz",
  "lessonId": "..."
}
```

### PATCH /api/v1/quizzes/:id

Update a quiz. **Roles**: teacher, admin

### DELETE /api/v1/quizzes/:id

Delete a quiz. **Roles**: teacher, admin

---

## Questions

### GET /api/v1/quizzes/:quizId/questions

Get all questions for a quiz.

**Authentication**: Required

### POST /api/v1/questions

Create a question for a quiz.

**Roles**: teacher, admin

```json
{
  "questionText": "What sign represents the letter Alif?",
  "questionType": "mcq",
  "marks": 2,
  "options": [
    { "text": "Open palm", "isCorrect": true },
    { "text": "Closed fist", "isCorrect": false },
    { "text": "Pointing finger", "isCorrect": false }
  ],
  "quizId": "..."
}
```

### PATCH /api/v1/questions/:id

Update a question. **Roles**: teacher, admin

### DELETE /api/v1/questions/:id

Delete a question. **Roles**: teacher, admin

---

## Quiz Attempts

### POST /api/v1/quiz-attempts

Submit quiz answers and receive score.

**Roles**: user (learners)

```json
{
  "quizId": "...",
  "answers": [
    { "questionId": "...", "selectedOptionId": 0 },
    { "questionId": "...", "selectedOptionId": 2 }
  ]
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
      "quizId": "...",
      "score": 8,
      "passed": true,
      "createdAt": "..."
    }
  }
}
```

### GET /api/v1/quiz-attempts/my-attempts

Get current user's quiz attempts.

**Roles**: Any authenticated user

### GET /api/v1/quiz-attempts/:id

Get a specific attempt with user answers.

**Roles**: Owner or teacher/admin
