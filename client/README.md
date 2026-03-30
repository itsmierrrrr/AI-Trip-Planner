# AI Trip Planner Client

Frontend application for AI Trip Planner, built with React and Vite.

## Commands

- Install dependencies: `npm install`
- Run development server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Environment Variables

Create a local `client/.env` file:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
VITE_APP_NAME=TripOS AI
VITE_HERO_HEADLINE=Your Next Trip, Designed by AI
VITE_HERO_SUBHEADING=A futuristic travel intelligence layer that builds routes, budgets, and discoveries.
VITE_HERO_PROMPT_EXAMPLE=Plan me a 7-day Japan trip under 1000 USD
VITE_PLANNER_PROMPT_PLACEHOLDER=Describe your trip
VITE_LOADING_MESSAGES=Scanning destinations...|Comparing routes...|Building your itinerary...
```

## Security Notes

- Do not place private API keys or server-side secrets in client environment variables.
- Any value prefixed with `VITE_` is embedded in the frontend bundle and publicly visible.
- Keep OAuth client secret and API provider secrets on the backend only.
