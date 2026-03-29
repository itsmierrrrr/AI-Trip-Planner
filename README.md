# AI Trip Planner

Full-stack AI Trip Planner with React + Vite frontend and Node.js + Express + MongoDB backend.

## Tech Stack

- Frontend: React, Vite, JavaScript, Tailwind CSS, React Router, Axios, Framer Motion, Lucide React
- Backend: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Google OAuth, OpenRouter API

## Project Structure

```txt
client/
  src/
    pages/
    components/
    layouts/
    context/
    services/
    hooks/
server/
  models/
  routes/
  controllers/
  middleware/
  config/
```

## API Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/google`
- `POST /api/trips/generate`
- `GET /api/trips`
- `POST /api/trips/save`
- `DELETE /api/trips/:id`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `GET /api/admin/trips`
- `DELETE /api/admin/users/:id`
- `DELETE /api/admin/trips/:id`

# Setup Instructions / Replace With Your Real Values

```env
# server/.env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=openrouter/free
OPENROUTER_APP_NAME=AI Trip Planner
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
PORT=5000
```

```env
# client/.env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=TripOS AI
VITE_HERO_HEADLINE=Your Next Trip, Designed by AI
VITE_HERO_SUBHEADING=A futuristic travel intelligence layer that builds routes, budgets, stays, and hidden gem discoveries in one smooth command.
VITE_HERO_PROMPT_EXAMPLE=Plan me a 7-day Japan trip under ₹1 lakh
VITE_PLANNER_PROMPT_PLACEHOLDER=Plan me a 5-day Goa trip under ₹30,000
VITE_LOADING_MESSAGES=Scanning the planet for hidden gems...|Teaching the AI how to pack a suitcase...|Negotiating hotel prices with imaginary robots...
```

Where these values are used:

- `your_mongodb_atlas_connection_string`
  Replace with your MongoDB Atlas URI from MongoDB Atlas cluster connection page.

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tripplanner
```

- `your_super_secret_jwt_key`
  Replace with a random long secret string.

Example:

```env
JWT_SECRET=trip_planner_secret_2026_random_string
```

- `your_openrouter_api_key`
  Replace with your API key from OpenRouter dashboard.

Example:

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxx
```

- `OPENROUTER_API_URL`
  OpenRouter endpoint used by backend trip generation.

Example:

```env
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
```

- `OPENROUTER_MODEL`
  OpenRouter model slug used for responses.

Example:

```env
OPENROUTER_MODEL=openrouter/free
```

- `OPENROUTER_APP_NAME`
  Value sent in the OpenRouter `X-Title` header.

Example:

```env
OPENROUTER_APP_NAME=AI Trip Planner
```

- `your_google_oauth_client_id`
  Replace with Google OAuth Client ID from Google Cloud Console.

Example:

```env
GOOGLE_CLIENT_ID=1234567890-abcdef.apps.googleusercontent.com
```

- `your_google_oauth_client_secret`
  Replace with Google OAuth Client Secret.

Frontend placeholders:

```js
const API_BASE_URL = "http://localhost:5000/api";
```

When deploying, change to your backend deployed URL:

```js
const API_BASE_URL = "https://your-backend.onrender.com/api";
```

For Google Login on frontend, use env-based value:

```jsx
<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
```

When deployed:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

Important security note:

- Never hardcode secrets in source code.
- Keep all keys and credentials in `.env` files.

# Before Running The Project

Checklist:

- Install dependencies with `npm install` in both `client` and `server` folders.
- Create `.env` files in both `client` and `server` folders using `.env.example` templates.
- Paste your MongoDB Atlas URI.
- Paste your OpenRouter API key.
- Paste your Google OAuth credentials.
- Start backend with `npm run server` (from root) or `npm run dev` (inside `server`).
- Start frontend with `npm run dev` (inside `client`) or `npm run client` (from root).

## Local Development

1. Install root helper scripts (optional):

```bash
npm install
```

2. Install frontend deps:

```bash
cd client
npm install
```

3. Install backend deps:

```bash
cd ../server
npm install
```

4. Start backend:

```bash
npm run dev
```

5. Start frontend in a new terminal:

```bash
cd ../client
npm run dev
```
