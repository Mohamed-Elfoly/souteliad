# Data Model: Core Backend

**Feature**: 002-core-backend
**Date**: 2026-02-07

## Overview

13 Mongoose models covering authentication, learning content, assessment,
progress tracking, community, and notifications. All models follow
Natours conventions (Constitution Principle VI).

---

## User

Central entity for all platform actors. Single model with role
discriminator.

| Field | Type | Constraints |
|-------|------|-------------|
| firstName | String | required, trim |
| lastName | String | required, trim |
| name | String | virtual (firstName + lastName) |
| email | String | required, unique, lowercase, validated |
| password | String | required, minlength 8, select: false |
| passwordConfirm | String | required (validation only, not persisted) |
| passwordChangedAt | Date | select: false |
| passwordResetToken | String | select: false |
| passwordResetExpires | Date | select: false |
| role | String | enum: [user, teacher, admin], default: user |
| phoneNum | String | trim |
| profilePicture | String | default: 'default.jpg' |
| active | Boolean | default: true, select: false |
| createdAt | Date | default: Date.now |

**Indexes**: `{ email: 1 }` (unique)
**Hooks**: Pre-save hash password, pre-save set passwordChangedAt, pre-find filter inactive users
**Methods**: `correctPassword(candidatePassword, userPassword)`, `changedPasswordAfter(JWTTimestamp)`, `createPasswordResetToken()`

---

## Level

Organizes lessons into progressive difficulty groups.

| Field | Type | Constraints |
|-------|------|-------------|
| title | String | required, trim, unique |
| description | String | trim |
| levelOrder | Number | required |
| adminId | ObjectId (ref: User) | required |
| createdAt | Date | default: Date.now |

**Indexes**: `{ levelOrder: 1 }`
**Virtuals**: `lessons` (virtual populate from Lesson)

---

## Lesson

Educational content belonging to a level.

| Field | Type | Constraints |
|-------|------|-------------|
| title | String | required, trim |
| description | String | trim |
| videoUrl | String | required |
| thumbnailUrl | String | |
| lessonOrder | Number | required |
| levelId | ObjectId (ref: Level) | required |
| teacherId | ObjectId (ref: User) | required |
| createdAt | Date | default: Date.now |

**Indexes**: `{ levelId: 1, lessonOrder: 1 }`
**Virtuals**: `quizzes` (virtual populate from Quiz)

---

## Quiz

Assessment linked to a lesson.

| Field | Type | Constraints |
|-------|------|-------------|
| title | String | required, trim |
| lessonId | ObjectId (ref: Lesson) | required |
| teacherId | ObjectId (ref: User) | required |
| createdAt | Date | default: Date.now |

**Indexes**: `{ lessonId: 1 }`
**Virtuals**: `questions` (virtual populate from Question)

---

## Question

Individual quiz question with options.

| Field | Type | Constraints |
|-------|------|-------------|
| questionText | String | required |
| questionType | String | enum: [mcq, true-false], default: mcq |
| marks | Number | required, default: 1 |
| options | Array of { text: String, isCorrect: Boolean } | required, min 2 options |
| quizId | ObjectId (ref: Quiz) | required |

**Indexes**: `{ quizId: 1 }`

---

## QuizAttempt

Record of a user taking a quiz.

| Field | Type | Constraints |
|-------|------|-------------|
| userId | ObjectId (ref: User) | required |
| quizId | ObjectId (ref: Quiz) | required |
| score | Number | required |
| passed | Boolean | required |
| createdAt | Date | default: Date.now |

**Indexes**: `{ userId: 1, quizId: 1 }`

---

## UserAnswer

Individual answer within a quiz attempt.

| Field | Type | Constraints |
|-------|------|-------------|
| attemptId | ObjectId (ref: QuizAttempt) | required |
| questionId | ObjectId (ref: Question) | required |
| selectedOptionId | Number | required (index of selected option) |

**Indexes**: `{ attemptId: 1 }`

---

## LessonProgress

Tracks lesson completion per user.

| Field | Type | Constraints |
|-------|------|-------------|
| userId | ObjectId (ref: User) | required |
| lessonId | ObjectId (ref: Lesson) | required |
| completedAt | Date | default: Date.now |

**Indexes**: `{ userId: 1, lessonId: 1 }` (compound unique — prevents duplicates)

---

## Post

Community content shared by users.

| Field | Type | Constraints |
|-------|------|-------------|
| content | String | required, trim |
| mediaUrl | String | |
| status | String | enum: [active, hidden, deleted], default: active |
| userId | ObjectId (ref: User) | required |
| teacherId | ObjectId (ref: User) | |
| createdAt | Date | default: Date.now |

**Indexes**: `{ userId: 1 }`, `{ createdAt: -1 }`
**Virtuals**: `comments` (virtual populate), `likes` (virtual populate)
**Query middleware**: Filter out posts with status 'deleted' by default

---

## Comment

Response to a community post.

| Field | Type | Constraints |
|-------|------|-------------|
| content | String | required, trim |
| postId | ObjectId (ref: Post) | required |
| userId | ObjectId (ref: User) | required |
| createdAt | Date | default: Date.now |

**Indexes**: `{ postId: 1 }`

---

## Like

Toggle-based reaction to a post (one per user per post).

| Field | Type | Constraints |
|-------|------|-------------|
| postId | ObjectId (ref: Post) | required |
| userId | ObjectId (ref: User) | required |

**Indexes**: `{ postId: 1, userId: 1 }` (compound unique)

---

## Report

Flagged content for moderation.

| Field | Type | Constraints |
|-------|------|-------------|
| postId | ObjectId (ref: Post) | required |
| userId | ObjectId (ref: User) | required (reporter) |
| teacherId | ObjectId (ref: User) | |
| reason | String | required, trim |
| status | String | enum: [pending, reviewed, dismissed], default: pending |
| createdAt | Date | default: Date.now |

**Indexes**: `{ postId: 1 }`, `{ status: 1 }`

---

## Notification

System messages delivered to users.

| Field | Type | Constraints |
|-------|------|-------------|
| type | String | required, enum: [lesson, quiz, community, system, announcement] |
| message | String | required |
| link | String | |
| userId | ObjectId (ref: User) | required (recipient) |
| adminId | ObjectId (ref: User) | (sender, optional) |
| teacherId | ObjectId (ref: User) | (sender, optional) |
| notificationId | String | |
| read | Boolean | default: false |
| createdAt | Date | default: Date.now |

**Indexes**: `{ userId: 1, read: 1 }`, `{ createdAt: -1 }`

---

## Entity Relationship Summary

```text
User (1) ──creates──> (N) Level
User (1) ──creates──> (N) Lesson
Level (1) ──contains──> (N) Lesson
Lesson (1) ──has──> (N) Quiz
Quiz (1) ──consists of──> (N) Question
User (1) ──submits──> (N) QuizAttempt
QuizAttempt (1) ──contains──> (N) UserAnswer
User (1) ──tracks──> (N) LessonProgress
Lesson (1) ──tracked in──> (N) LessonProgress
User (1) ──publishes──> (N) Post
Post (1) ──has──> (N) Comment
Post (1) ──has──> (N) Like
Post (1) ──is reported in──> (N) Report
User (1) ──receives──> (N) Notification
```
