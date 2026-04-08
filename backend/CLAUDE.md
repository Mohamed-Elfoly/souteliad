# sout-elyad Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-02-07

## Active Technologies
- Node.js 20.x LTS with CommonJS modules (002-core-backend)
- MongoDB (local dev: `mongodb://localhost:27017/sout-elyad`, production: MongoDB Atlas) (002-core-backend)

- Node.js LTS (v20.x) with CommonJS modules (001-project-init)
- Express.js ^4.18
- Mongoose ^7.x (MongoDB Atlas)
- ESLint (airbnb + prettier + node)

## Project Structure

```text
sout-elyad/
├── app.js              # Express app + middleware
├── server.js           # Server + DB connection
├── config.env          # Environment config (git-ignored)
├── controllers/        # Route handlers
│   ├── errorController.js
│   └── handlerFactory.js
├── models/             # Mongoose schemas
├── routes/             # Express routers
├── utils/              # Utilities
│   ├── appError.js
│   ├── catchAsync.js
│   └── apiFeatures.js
├── public/img/         # Uploaded images
└── dev-data/data/      # Seed data (JSON)
```

## Commands

```bash
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start in production mode
npm run start:prod   # Start with NODE_ENV=production
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint issues
```

## Code Style

- CommonJS modules (`require`/`module.exports`)
- Files: camelCase (`userController.js`)
- Functions/variables: camelCase (`getAllLessons`)
- Models/Classes: PascalCase (`User`, `Lesson`)
- Routes: kebab-case URLs (`/api/v1/community-posts`)
- Env vars: SCREAMING_SNAKE_CASE (`JWT_SECRET`)
- ESLint airbnb config + Prettier
- Follow Natours reference project conventions

## Recent Changes
- 002-core-backend: Added Node.js 20.x LTS with CommonJS modules
- 002-core-backend: Added Node.js 20.x LTS with CommonJS modules

- 001-project-init: Added Node.js LTS (v20.x) with CommonJS modules

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
