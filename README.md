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

## Environment Setup

Create `server/.env` from `server/.env.example`:

```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_long_random_jwt_secret>
OPENROUTER_API_KEY=<your_openrouter_api_key>
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=openrouter/free
OPENROUTER_APP_NAME=AI Trip Planner
GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
GOOGLE_CLIENT_SECRET=<your_google_oauth_client_secret>
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173,http://localhost:5178
CORS_ALLOW_LOCALHOST=true
SERVER_URL=http://localhost:5000
PORT=5000
```

Create `client/.env`:

```env
VITE_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TripOS AI
VITE_HERO_HEADLINE=Your Next Trip, Designed by AI
VITE_HERO_SUBHEADING=A futuristic travel intelligence layer that builds routes, budgets, and discoveries.
VITE_HERO_PROMPT_EXAMPLE=Plan me a 7-day Japan trip under 1000 USD
VITE_PLANNER_PROMPT_PLACEHOLDER=Describe your trip
VITE_LOADING_MESSAGES=Scanning destinations...|Comparing routes...|Building your itinerary...
```

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
