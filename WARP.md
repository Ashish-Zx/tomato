# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This repo is a full-stack "Zomato Food Delivery" demo: a TikTok-style vertical video feed for food discovery, with separate experiences for end users and food partners. The root `README.md` documents product features, tech stack (React/Vite frontend, Node/Express/MongoDB backend, ImageKit for video storage), installation steps, and a detailed list of REST API endpoints.

The project is organized as a simple monorepo with two main apps:
- `backend/` – Node.js + Express API with MongoDB (Mongoose) and JWT auth
- `frontend/` – React + Vite SPA that consumes the backend API

## Environment & Setup

### Backend environment

Backend environment variables (see root `README.md`):
- `JWT_SECRET` – JWT signing secret
- `MONGO_URI` – MongoDB Atlas connection string
- `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT` – ImageKit configuration

Local setup (from repo root):
```bash
cd backend
npm install
npm start
```

`server.js` listens on `process.env.PORT || 8000` for local development and exports the Express app for Vercel/serverless via `module.exports = app`.

### Frontend environment

Frontend uses Vite environment variables:
- `VITE_API_URL` – base URL for the backend API (see `frontend/src/config/api.js`). Defaults to `http://localhost:8000` if not set.

Local setup (from repo root):
```bash
cd frontend
npm install
npm run dev
```

This starts the Vite dev server (by default on `http://localhost:5173`). Ensure the backend is running and that `VITE_API_URL` points at the backend URL.

## Common Commands

From repo root, run commands inside the corresponding app directory.

### Backend

- Install dependencies:
  ```bash
  cd backend
  npm install
  ```
- Run dev server (with `nodemon`):
  ```bash
  cd backend
  npm start
  ```
- There is no dedicated build step; this is a plain Node/Express app.
- Tests: `npm test` is a placeholder and will just print an error; no automated backend tests are configured.

### Frontend

Defined in `frontend/package.json`:

- Start dev server:
  ```bash
  cd frontend
  npm run dev
  ```
- Build for production:
  ```bash
  cd frontend
  npm run build
  ```
- Preview production build (after `npm run build`):
  ```bash
  cd frontend
  npm run preview
  ```
- Lint:
  ```bash
  cd frontend
  npm run lint
  ```

No test runner is configured for the frontend; there is currently no command to run a single test.

## Backend Architecture

### Entry points & deployment

- `backend/server.js`
  - Imports `./src/app.js` (Express app) and `./src/db/db.js` (Mongo connection helper).
  - Immediately calls `connectDB()` once on startup.
  - When run directly (`require.main === module`), starts HTTP server on `PORT` (default `8000`).
  - Exports the Express app for hosting providers like Vercel.

- `backend/api/index.js`
  - Serverless/Vercel entry that eagerly requires `../src/db/db` and `../src/app`.
  - Calls `connectDB()` and exports the Express app.
  - Wraps startup in try/catch and, on failure, exports a handler that reports the startup stage and error details in JSON.

- `backend/api/debug.js`
  - Lightweight Vercel function used to verify that the app can be required and that env vars like `MONGO_URI` exist.
  - Returns JSON with an "app_integrity" status and basic environment checks.

### Express app configuration

`backend/src/app.js` wires the core middleware and routes:

- Global middleware:
  - `cors({ origin: true, credentials: true })` and `app.options('*', cors())` – permissive CORS with credentials enabled.
  - `express.json()` – JSON body parsing.
  - `cookie-parser` – to read `token` from cookies.

- Error-handling middleware:
  - Logs the error and returns a generic 500 JSON response.
  - Includes the error message only when `NODE_ENV === 'development'`.

- Database reconnect middleware:
  - Uses `mongoose.connection.readyState` to detect disconnection.
  - On each request, if disconnected (`readyState === 0`), attempts to call `connectDB()` again.
  - Stores `lastDbError` (string) that is surfaced via the health endpoint below.

- Health & diagnostics routes:
  - `GET /api/test-db` – explicitly tries to connect to MongoDB and reports connection status, `readyState`, and error details where applicable.
  - `GET /` – health check that reports:
    - `status: "ok"`
    - current Mongo connection state (`db_status`)
    - `last_db_error`
    - whether `MONGO_URI`, `JWT_SECRET`, and `IMAGEKIT_PRIVATE_KEY` environment variables are defined.

- Feature routes (all mounted under `/api`):
  - `app.use("/api/auth", authRoutes)` – auth for both users and food partners.
  - `app.use("/api/food", foodAuthRoutes)` – creation, listing, deletion of food items.
  - `app.use("/api/foodpartner", foodPartnerRoutes)` – public partner profile.
  - `app.use("/api/user", userRoutes)` – user interactions (like/save/profile).

### Routing & controllers

**Routes directory (`backend/src/routes/`):**

- `auth.routes.js` (mounted at `/api/auth`):
  - User:
    - `POST /user/register` → `registerUser`
    - `POST /user/login` → `loginUser`
    - `GET /user/logout` → `logoutUser`
  - Food partner:
    - `POST /foodpartner/register` → `registerFoodPartner`
    - `POST /foodpartner/login` → `loginFoodPartner`
    - `GET /foodpartner/logout` → `logoutFoodPartner`
    - `GET /foodpartner/imagekit-auth` → `getFoodPartnerImageKitAuth` (requires `authFoodPartnerMiddleware`)
    - `GET /foodpartner/profile` → `getFoodPartnerProfile` (requires `authFoodPartnerMiddleware`)

- `food.auth.routes.js` (mounted at `/api/food`):
  - `POST /` – create food item; requires `authFoodPartnerMiddleware`, uses `multer` (`memoryStorage`) to accept an uploaded `video` file, and delegates to `food.controller.createFood`.
  - `GET /` – get all food items; requires `authUserMiddleware`.
  - `GET /partner/:id` – get foods by partner; uses `authEitherMiddleware` so both users and partners can access.
  - `DELETE /:id` – delete food item; requires `authFoodPartnerMiddleware` and checks that the item belongs to the authenticated partner.

- `user.routes.js` (mounted at `/api/user`):
  - Applies `authUserMiddleware` to all routes.
  - `POST /like/:foodId` – toggle like.
  - `POST /save/:foodId` – toggle save.
  - `GET /liked` – retrieve liked foods (populated `Food` docs).
  - `GET /saved` – retrieve saved foods.
  - `GET /profile` – current user profile summary.
  - `PUT /profile` – update profile fields.

- `food-partner.routes.js` (mounted at `/api/foodpartner`):
  - `GET /:id` – public food partner profile, aggregating partner info and their foods.

**Controllers directory (`backend/src/controllers/`):**

- `auth.controller.js`:
  - User registration/login/logout using `userModel`, `bcrypt`, `jsonwebtoken` and `JWT_SECRET`.
  - Food partner registration/login/logout using `FoodPartnerModel`.
  - Issues JWTs and sets them as `httpOnly` cookies (`sameSite: 'lax'` for partners) and also returns the token in some responses.
  - `getFoodPartnerProfile` – returns the currently authenticated partner (from `req.foodPartner`).
  - `getFoodPartnerImageKitAuth` – constructs an `ImageKit` instance with env vars, calls `getAuthenticationParameters()`, and returns auth parameters plus the public key.

- `food.controller.js`:
  - `createFood` – accepts either a `videoUrl` (client-uploaded URL) or a video file via `multer`.
    - If a file is present, uploads to ImageKit using `uploadFileToImageKit` (from `storage.services`) and uses the returned URL.
    - Creates a `Food` document with `name`, `description`, `price`, `video`, and `foodpartner` from `req.foodPartner._id`.
  - `getFoods` – returns all food items.
  - `getFoodsByPartnerId` – returns foods filtered by `foodpartner`.
  - `deleteFood` – ensures the food item exists and belongs to the authenticated partner before deletion.

- `user.controller.js`:
  - `likeFood` – toggles a foodId inside `user.likedFoods` and returns whether it is now liked.
  - `saveFood` – toggles a foodId inside `user.savedFoods`.
  - `getLikedFoods` / `getSavedFoods` – returns populated lists of `Food` documents.
  - `getUserProfile` – returns basic profile including counts of liked/saved items.
  - `updateUserProfile` – updates `fullName` and `email` for the current user.

- `food-partner.controller.js`:
  - `getFoodPartnerById` – fetches a partner by id (excluding password), then fetches all foods belonging to that partner and returns both.

### Models & persistence

Located under `backend/src/models/`:

- `user.model.js` – `User` schema with `fullName`, `email` (unique), `password`, and array references to liked and saved `Food` items.
- `foodpartner.model.js` – `FoodPartner` schema with basic store metadata (name, email, contact info, address) and password.
- `food.model.js` – `Food` schema with `name`, `description`, `price`, `video` (URL string), and a reference to the owning `FoodPartner`.

Database connection helper:

- `src/db/db.js` – wraps `mongoose.connect(process.env.MONGO_URI)` and logs errors but does **not** throw, allowing the server to start even if MongoDB is unavailable. This is important when debugging: use `/api/test-db` or the root health endpoint to see connection status instead of expecting the process to crash.

### Auth middlewares

`backend/src/middlewares/authmiddleware.js` centralizes auth logic:

- All middlewares look for a JWT either in the `token` cookie or the `Authorization: Bearer <token>` header and verify it using `JWT_SECRET`.
- `authFoodPartnerMiddleware` – loads a `FoodPartner` by decoded id and attaches it to `req.foodPartner`.
- `authUserMiddleware` – loads a `User` and attaches it to `req.user`.
- `authEitherMiddleware` – first tries to load a `FoodPartner`, then a `User`, setting `req.userType` to `'partner'` or `'user'` accordingly.

### Storage services

Under `backend/src/services/`:

- `storage.services.js` – integrates with ImageKit via `uploadFileToImageKit`, used by `food.controller.createFood`.
- `local-storage.services.js` – alternative local file storage implementation (currently commented out in `food.controller.js`), useful if you want to avoid ImageKit in local development.

## Frontend Architecture

### Entry & routing

- `frontend/src/main.jsx`
  - Renders `<App />` into `#root` and imports global styles from `index.css`.

- `frontend/src/App.jsx`
  - Imports `./styles/auth.css` and renders `<AppRoutes />`.

- `frontend/src/routes/AppRoutes.jsx`
  - Uses `BrowserRouter` + `Routes` from `react-router-dom`.
  - Routes:
    - `/` → redirects to `/user/login`.
    - `/user/register` → `UserRegister` page.
    - `/user/login` → `UserLogin` page.
    - `/user/profile` → `UserProfile` page.
    - `/home` → `Home` (vertical video feed) page.
    - `/foodPartner/register` → `FoodPartnerRegister` page.
    - `/foodPartner/login` → `FoodPartnerLogin` page.
    - `/foodPartner/dashboard` → `Dashboard` (partner management) page.
    - `/foodPartner/create-food` → `CreateFood` form for uploading new items.
    - `/foodPartner/profile/:id` → `Profile` – public view of a partner and their items.

### API configuration & networking

- `frontend/src/config/api.js`
  - Exports `API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'`.

- `frontend/src/axiosConfig.js`
  - Creates an `axiosInstance` with:
    - `baseURL: API_URL`
    - `withCredentials: true` (to send cookies for JWT-based auth).
  - Adds a request interceptor that reads `token` from `localStorage` and, if present, attaches it as `Authorization: Bearer <token>`.
  - Used by pages like `UserProfile` and `Dashboard` for API calls.

**Important note:** Some components (e.g. `Home.jsx`, `Dashboard.jsx`) still make direct `axios` calls to the hard-coded deployed backend at `https://tomato-bc76.vercel.app/...` for certain endpoints, while others use `import.meta.env.VITE_API_URL`. When modifying or adding API calls, be consistent about which backend base URL you intend to target and consider using `axiosConfig` everywhere for easier environment management.

### Key screens

- `pages/general/Home.jsx`
  - Implements the TikTok-style vertical video feed.
  - Uses a scroll container and a `videoRefs` array to control playback so that only the in-view video plays.
  - Fetches foods from `VITE_API_URL + '/api/food'` on mount (with `withCredentials: true`) and maps them to a video list.
  - Allows users to:
    - Like/unlike via `POST /api/user/like/:foodId`.
    - Save/unsave via `POST /api/user/save/:foodId`.
    - Visit partner store via `navigate('/foodPartner/profile/:id')`.
  - Includes a global mute/unmute toggle, initially muted to satisfy browser autoplay rules.

- `pages/user/UserProfile.jsx`
  - Fetches user profile, saved foods, and liked foods in parallel from:
    - `/api/user/profile`
    - `/api/user/saved`
    - `/api/user/liked`
  - Displays profile info, counts, and allows editing `fullName` and `email` via `PUT /api/user/profile`.
  - Shows two tabs (saved vs liked) with video grids; clicking a video opens the shared `VideoPlayer` component.
  - Uses `axiosConfig` so it benefits from the JWT cookie and optional bearer token.

- `pages/food-partner/Dashboard.jsx`
  - On load, fetches the partner profile from `/api/auth/foodpartner/profile` and then that partner's foods via `/api/food/partner/:id`.
  - Manages a grid of the partner's food videos with summary stats, and provides actions to:
    - Navigate to upload form.
    - View the public partner profile.
    - Delete individual food items via `DELETE /api/food/:id`.
  - Uses the shared `VideoPlayer` for fullscreen watching.

Other auth and partner pages (`UserLogin`, `UserRegister`, `FoodPartnerLogin`, `FoodPartnerRegister`, `CreateFood`, `Profile`, `VideoPlayer`) are located under `frontend/src/pages/` and follow the same pattern: React components that call backend endpoints either via `axiosConfig` or direct `axios` calls, and navigate using `react-router-dom`.

### Auth flow (frontend perspective)

- After successful login/registration, the backend sets an `httpOnly` `token` cookie.
- Some flows also return the token in the response; components may store it in `localStorage`.
- Subsequent API calls use:
  - Cookies (via `withCredentials: true`) for JWT validation on the backend.
  - Optional bearer token from `localStorage` attached by the Axios interceptor.

When adding new API calls, prefer using `axiosConfig` so that both cookies and bearer token handling remain centralized.

## Working Effectively in This Repo

- For backend changes, follow the existing separation of concerns:
  - Add/update Mongoose models under `backend/src/models/`.
  - Add controllers under `backend/src/controllers/`.
  - Wire new endpoints in `backend/src/routes/` and mount them from `src/app.js` if they belong to a new route group.
  - Reuse `authFoodPartnerMiddleware`, `authUserMiddleware`, or `authEitherMiddleware` for protected routes.

- For frontend changes:
  - Register new pages/routes in `frontend/src/routes/AppRoutes.jsx`.
  - Use `axiosConfig` for API calls and respect `VITE_API_URL`.
  - Keep video-related UIs consistent by reusing the existing `VideoPlayer` and feed/grid patterns where it makes sense.

Refer to the root `README.md` for a concise list of available API endpoints and deployment details.
