# Next.js Migration Plan

## Goal
Deploy HealMotion as a single Next.js application on Vercel so the frontend and backend logic live in one repo, use Vercel-native API routes, and avoid FastAPI/serverless issues while keeping existing features (profile form, workout assistant, diet assistant via Gemini).

---

## Phase 1 – Project Bootstrap
1. **Create Next.js app**  
   - From repo root run `npx create-next-app@latest healmotion-next --typescript` (or JavaScript if preferred).  
   - Choose App Router and Tailwind only if useful; otherwise keep defaults for minimal setup.
2. **Move into repo root**  
   - Remove the old `frontend/` once migration is done, but initially keep both folders until parity is confirmed.  
   - Decide whether to keep legacy FastAPI for local experimentation; production will be Next.js only.

---

## Phase 2 – UI Migration
1. **Component inventory**  
   - Map current React components/pages (Profile, Workout, Diet, Home, shared components).  
   - Recreate folder structure under `app/(pages)/...` or `pages/` depending on App vs Pages Router.
2. **Styles/assets**  
   - Copy CSS modules or convert to CSS-in-JS. For global styles, use `app/globals.css` or `styles/globals.css`.
3. **Routing updates**  
   - Replace `react-router-dom` usage with native Next.js routing (`app/profile/page.tsx`, etc.).  
   - Update links to use `next/link`.

---

## Phase 3 – API Routes
1. **Profile endpoint (`/api/profile`)**  
   - Implement POST handler that validates the payload and simply echoes success (or stores temporarily in KV later).  
   - For stateless operation, return the sanitized profile so the client can keep it in local state.
2. **Workout endpoint (`/api/analyze`)**  
   - Accept both profile data and injury in the body.  
   - Call Gemini via `fetch` (available in Next.js API routes) hitting `https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key=...`.  
   - Parse the JSON, extract the workout plan, and return simplified structure identical to current frontend expectations.
3. **Diet endpoint (`/api/diet`)**  
   - Same pattern as workout, but produce diet plan JSON.
4. **Shared helpers**  
   - Create `lib/gemini.ts` (or `.js`) to build prompts, call Gemini, and normalize responses so both endpoints share logic.  
   - Centralize environment access (e.g., `const apiKey = process.env.GEMINI_API_KEY` with runtime checks).
5. **Error handling**  
   - Wrap Gemini calls with try/catch and return `NextResponse.json({ error: ... }, { status: 500 })` so clients get meaningful errors.  
   - Log errors via `console.error` (Vercel captures automatically).

---

## Phase 4 – Frontend Integration
1. **Update data flow**  
   - Profile form should keep state locally and pass it to workout/diet requests (`fetch('/api/analyze', { body: JSON.stringify({ profile, injury }) })`).  
   - Remove reliance on server-side `user_profiles`.
2. **Loading/error states**  
   - Reuse existing UI but ensure it interprets the new API responses (structure should match, so changes minimal).
3. **Environment variables**  
   - Use `.env.local` with `NEXT_PUBLIC_API_BASE` only if needed; generally `/api/...` works without extra config.  
   - Ensure `GEMINI_API_KEY` is never exposed on the client (only referenced in API routes).

---

## Phase 5 – Cleanup & Deployment
1. **Remove legacy backend**  
   - Once Next.js version works end-to-end, delete `backend/` and `api/` directories plus old `vercel.json`.  
   - Update root `package.json` scripts to use Next.js commands (`dev`, `build`, `start`, `lint`).
2. **Vercel setup**  
   - Set project root to the new Next.js folder (or move files to repo root).  
   - Add `GEMINI_API_KEY` (and optional `GEMINI_MODEL`) in Vercel → Settings → Environment Variables.
3. **Deploy**  
   - `vercel` for preview, `vercel --prod` for production.  
   - Verify `/api/profile`, `/api/analyze`, `/api/diet` via browser DevTools or `curl`.
4. **Documentation**  
   - Update README with new development instructions (`npm run dev`, env vars, how to add prompts).

---

## Optional Enhancements
- **Persistent storage**: Introduce Vercel KV, Upstash Redis, or Supabase later if profile history is required.  
- **Auth**: Add NextAuth for user login if per-user data becomes important.  
- **Caching**: Cache Gemini responses for identical injuries to save tokens.  
- **Testing**: Add unit tests for Gemini parser helpers and integration tests via Playwright.

---

## Timeline Snapshot
| Phase | Tasks | Est. Time |
| --- | --- | --- |
| 1 | Bootstrap Next.js project | 0.5 day |
| 2 | Migrate UI & styles | 1–1.5 days |
| 3 | Implement API routes & Gemini helper | 1 day |
| 4 | Wire frontend to new APIs | 0.5 day |
| 5 | Cleanup & deploy | 0.5 day |

Total: **~3.5 days** (can compress if features are pared down or extended if enhancements added).

---

## Next Steps
1. Scaffold the Next.js app (Phase 1) and push to a new branch.  
2. Port UI + implement API routes (Phases 2–3).  
3. Update frontend to call new APIs, test locally, and deploy to Vercel.  
4. Remove legacy directories once production looks good.
