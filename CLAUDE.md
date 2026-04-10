# Sout-Elyad Development Guidelines

**Full-Stack Monorepo** - Backend (Node.js/Express) + Frontend (React/Vite)

## Monorepo Structure

```text
sout-elyad/
├── backend/          # Node.js + Express API (port 3000)
├── frontend/         # React + Vite SPA (port 5173)
└── package.json      # Root scripts with concurrently
```

## Quick Start

```bash
# Install all dependencies (root + backend + frontend)
npm run install:all

# Start both backend + frontend concurrently
npm run dev
```

- **Backend API**: http://localhost:3000
- **Frontend Dev**: http://localhost:5173
- **API Proxy**: Frontend proxies `/api/*` to backend

## Project-Specific Guidelines

- **Backend**: See [backend/CLAUDE.md](backend/CLAUDE.md) for backend-specific conventions
- **Frontend**: React 19 + Vite 7, ESLint, ES modules

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend + frontend |
| `npm run dev:backend` | Backend only (nodemon) |
| `npm run dev:frontend` | Frontend only (Vite) |
| `npm run install:all` | Install root + backend + frontend deps |
| `npm run lint` | Lint both projects |
| `npm run build:frontend` | Build frontend for production |

## Code Style

### Backend (Node.js)
- CommonJS modules (`require`/`module.exports`)
- Files: camelCase (`userController.js`)
- Functions: camelCase (`getAllLessons`)
- Models: PascalCase (`User`, `Lesson`)
- Routes: kebab-case (`/api/v1/community-posts`)
- ESLint: airbnb + prettier

### Frontend (React)
- ES modules (`import`/`export`)
- Components: PascalCase (`UserProfile.jsx`)
- Functions: camelCase (`handleSubmit`)
- CSS: Component-scoped or global
- ESLint: React + Hooks rules

## Environment

- Node.js: 20.x LTS
- MongoDB: `mongodb://localhost:27017/sout-elyad`
- Backend Port: 3000 (configurable in `backend/config.env`)
- Frontend Port: 5173 (configurable in `frontend/vite.config.js`)
- CORS: Frontend origin allowed (`http://localhost:5173`)

## Git Workflow

- Current branch: `002-core-backend`
- Main branch: `main`
- Commit messages: Imperative mood, concise
- Co-authored by: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

## Notes

- Backend uses JWT for authentication
- Multer handles video uploads (AI practice feature)
- MongoDB local for development, Atlas for production
- Frontend Vite proxy configured for `/api/*` routes
