# Quickstart: Sout-Elyad Backend

## Prerequisites

- Node.js 20.x LTS installed
- MongoDB Atlas account with a cluster and database created
- Git

## Setup

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd sout-elyad
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment configuration**

   Create a `config.env` file in the project root:

   ```env
   NODE_ENV=development
   PORT=3000

   DATABASE=mongodb+srv://<username>:<PASSWORD>@<cluster>.mongodb.net/sout-elyad?retryWrites=true&w=majority
   DATABASE_PASSWORD=your_atlas_password

   CORS_ORIGIN=http://localhost:3000
   ```

   Replace `<username>`, `<PASSWORD>`, and `<cluster>` with your
   MongoDB Atlas credentials.

4. **Start the application**

   Development mode (auto-restart on changes):
   ```bash
   npm run dev
   ```

   Production mode:
   ```bash
   npm start
   ```

5. **Verify it works**

   ```bash
   curl http://localhost:3000/api/v1/health
   ```

   Expected response:
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

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| dev | `npm run dev` | Start with nodemon (auto-restart) |
| start | `npm start` | Start in production mode |
| start:prod | `npm run start:prod` | Start with NODE_ENV=production |
| lint | `npm run lint` | Run ESLint on all JS files |
| lint:fix | `npm run lint:fix` | Auto-fix ESLint issues |

## Project Structure

```
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

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| NODE_ENV | Yes | `development` |
| PORT | Yes | `3000` |
| DATABASE | Yes | MongoDB Atlas connection string |
| DATABASE_PASSWORD | Yes | Atlas DB password |
| CORS_ORIGIN | Yes | `http://localhost:3000` |

Additional variables will be documented as features are added
(JWT_SECRET, EMAIL_HOST, etc.).
