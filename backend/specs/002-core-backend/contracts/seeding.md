# Seeding Script Contract

**Script**: `dev-data/import-dev-data.js`

## Usage

```bash
# Import all sample data
node dev-data/import-dev-data.js --import

# Delete all data
node dev-data/import-dev-data.js --delete
```

## Sample Data Files

Located in `dev-data/data/`:

| File | Records | Description |
|------|---------|-------------|
| users.json | 5 | 1 admin, 2 teachers, 2 learners |
| levels.json | 4 | Basics, Daily Life, Advanced, Real-time |
| lessons.json | 8 | 2 lessons per level |
| quizzes.json | 4 | 1 quiz per 2 lessons |
| questions.json | 12 | 3 questions per quiz |
| posts.json | 5 | Sample community posts |

## Import Order (dependencies)

1. Users (no dependencies)
2. Levels (references adminId from Users)
3. Lessons (references levelId, teacherId)
4. Quizzes (references lessonId, teacherId)
5. Questions (references quizId)
6. Posts (references userId)

## Delete Order (reverse)

1. Posts, Questions, Quizzes, Lessons, Levels, Users

## Notes

- User passwords in JSON are plain text; the import script hashes them
  via Mongoose pre-save hook.
- Sample admin: `admin@sout-elyad.com` / `password123`
- Sample teacher: `teacher@sout-elyad.com` / `password123`
- Sample learner: `user@sout-elyad.com` / `password123`
