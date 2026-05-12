# AI Trip Planner

- Built an AI-powered trip planning platform using React + Vite on the frontend and Node.js + Express on the backend.
- The app generates intelligent travel itineraries, personalized destination recommendations, budget-aware plans, and real-time trip insights through a smooth, responsive user experience.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Google OAuth, OpenRouter

## Project Structure

```txt
client/
  src/
server/
  config/
  controllers/
  middleware/
  models/
  routes/
```

## API Routes

- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/google
- POST /api/trips/generate
- GET /api/trips
- POST /api/trips/save
- DELETE /api/trips/:id
- GET /api/admin/stats
- GET /api/admin/users
- GET /api/admin/trips
- DELETE /api/admin/users/:id
- DELETE /api/admin/trips/:id

## Security Guidelines

- Never commit real keys, tokens, passwords, or OAuth secrets.
- Keep secrets only in local environment files and secret managers.
- Rotate any credential immediately if it was ever exposed.
- Ensure `.env` files are ignored by git before committing.

## Local Development

1. Install dependencies in root, client, and server.

```bash
npm install
cd client && npm install
cd ../server && npm install
```

2. Start backend (inside `server`):

```bash
npm run dev
```

3. Start frontend (inside `client`, new terminal):

```bash
npm run dev
```
