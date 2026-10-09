# Context — Student Portfolio + Task Manager API

## 1. Project Overview

A college practical project (B.Tech IT — Milan Vadhel) split across two repositories. The **frontend** (`portfolio-24it101`) is a React single-page portfolio/dashboard that lists GitHub repos and manages tasks. The **backend** (`task-manager-api-24it101`) is a REST API built with Express + MongoDB (Mongoose) exposing CRUD endpoints for tasks. The frontend calls the backend at `http://localhost:5000`. Target audience: course instructors evaluating practical assignments.

**Practical progress:** frontend is complete through Practical 8 (lazy + Suspense code splitting). Backend has since added Practical 9 (node-cache caching) and Practical 10 (event-driven async notifications via Node's built-in `events`). **Neither changed the API contract, so the frontend required no code changes** — see the two repos' docs for details.

**Practical 11 (Docker):** both apps are containerized and orchestrated by Docker Compose. The Compose file lives in the **frontend** repo and builds the backend from its sibling directory `../task-manager-api-24it101`, alongside an official `mongo:7.0` service on a bridge network `app-network` with a `mongo_data` named volume. Only code change: `src/App.jsx` now imports `./components/NavBar` (exact filename — Linux containers are case-sensitive).

---

## 2. Tech Stack

### Frontend (`d:\portfolio-24it101`)

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | — |
| Framework | React | ^19.2.7 |
| Routing | react-router-dom | ^7.18.1 |
| Bundler | Vite | ^8.1.1 |
| Build plugin | @vitejs/plugin-react | ^6.0.3 |
| Linter | Oxlint | ^1.71.0 |
| Font | Google Fonts — Poppins (loaded via CDN in `index.html`) | — |
| Module system | ESM (`"type": "module"` in package.json) | — |
| Containers | Docker + Docker Compose | Practical 11 |
| Build image | `node:22-alpine` | Vite 8 requires `^20.19.0 || >=22.12.0` |
| Prod server | `nginx:1.27-alpine` | Serves `dist/` with SPA fallback |

### Backend (`d:\task-manager-api-24it101`)

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | — |
| Framework | Express | ^4.22.2 |
| ODM | Mongoose | ^9.9.1 |
| Database | MongoDB Atlas (cloud) | — |
| CORS | cors | ^2.8.6 |
| Env vars | dotenv | ^16.4.5 |
| Caching | node-cache | (latest) |
| Events | Node built-in `events` | Async task notifications (Practical 10) |
| Module system | CommonJS (`require`) | — |

> **No TypeScript in either repo. No test framework installed. No formatter configured.**

---

## 3. Architecture

```
┌────────────────────────────┐       HTTP (port 5000)       ┌──────────────────────────┐
│  React SPA (Vite)          │ ─────── /tasks CRUD ───────► │  Express API             │
│  portfolio-24it101         │                              │  task-manager-api-24it101│
│  Runs on Vite dev server   │                              │  Connects to MongoDB     │
│  (default :5173)           │                              │  Atlas via MONGO_URI     │
└────────────────────────────┘                              └──────────────────────────┘
```

**Practical 11 — the same two apps, containerized (`docker-compose.yml` in this repo):**

```
Browser ──► localhost:5173 ──► frontend :80  (nginx, built by ./Dockerfile)        ┐
Browser ──► localhost:5000 ──► backend :5000 (node, built by ../task-manager-api) ─┼─ all three on
                                   └──► mongodb:27017 (mongo:7.0) ◄──────────────┘   app-network
                                 data persisted in named volume `mongo_data` → /data/db
```

### Frontend directory structure

```
portfolio-24it101/
├── index.html              # HTML shell, loads Poppins font, mounts #root
├── vite.config.js          # Minimal Vite config — just react() plugin
├── .oxlintrc.json          # Lint rules: react hooks + export-components
├── Dockerfile              # Multi-stage: node:22-alpine build → nginx:1.27-alpine serve (Practical 11)
├── nginx.conf              # SPA fallback (try_files → /index.html) for React Router (Practical 11)
├── .dockerignore           # Excludes node_modules/, .env*, .git/, dist/ from image (Practical 11)
├── docker-compose.yml      # Orchestrates frontend + backend + mongodb (Practical 11)
├── package.json
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx            # Entry — BrowserRouter + StrictMode
    ├── App.jsx             # Top-level routes: /, /projects, /contact — lazy() + Suspense (P8); imports ./components/NavBar with exact case (P11 fix)
    ├── App.css             # Vite scaffold CSS (mostly unused boilerplate)
    ├── index.css           # Actual design system — CSS custom props, all component styles
    ├── api.js              # fetch-based API client — getTasks, createTask, updateTask, deleteTask
    ├── assets/             # Static images (hero.png, react.svg, vite.svg)
    ├── components/
    │   ├── NavBar.jsx      # Sticky navbar with NavLink active styling
    │   ├── TaskCard.jsx    # Task display + inline edit + toggle complete + delete
    │   ├── RepoCard.jsx    # GitHub repo card (stars, language, date, link)
    │   ├── Header.jsx      # Simple header (unused in current routing)
    │   ├── Footer.jsx      # Simple footer (unused in current routing)
    │   ├── About.jsx       # About section (unused in current routing)
    │   ├── Skills.jsx      # Skills list (unused in current routing)
    │   ├── Spinner.jsx     # Plain text "Loading..." (unused — inline spinner used instead)
    │   └── ErrorMessage.jsx # Has a bug — button JSX is outside the return statement
    └── pages/
        ├── Home.jsx        # Landing page with CTA → /projects
        ├── Projects.jsx    # Task CRUD UI — form + task list + toast notifications
        ├── Contact.jsx     # Static contact form (no submit handler)
        └── NotFound.jsx    # 404 page (exists but not wired into Routes)
```

### Backend directory structure

```
task-manager-api-24it101/
├── server.js               # Express app — middleware, routes, caching, event emits, error handler, listen
├── cache.js                # Shared NodeCache instance (60s TTL) — Practical 9
├── events.js               # Shared EventEmitter instance — Practical 10
├── listeners.js            # task-created / task-deleted / error listeners — Practical 10
├── compare.js              # EDA vs non-EDA response-time demo — Practical 10
├── models/
│   └── Task.js             # Mongoose schema + pre-save hook + model export
├── .env                    # MONGO_URI (git-ignored — never copied into Docker)
├── .env.example            # Template for MONGO_URI
├── .gitignore              # Ignores node_modules/ and .env
├── Dockerfile              # node:22-alpine API image, EXPOSE 5000 (Practical 11)
├── .dockerignore           # Keeps .env, node_modules/, .git/ out of image (Practical 11)
├── package.json
└── README.md               # Comprehensive API docs
```

---

## 4. Setup & Commands

### Frontend

```bash
cd d:\portfolio-24it101
npm install
npm run dev        # Vite dev server (default http://localhost:5173)
npm run build      # Production build → dist/
npm run preview    # Preview production build
npm run lint       # Run Oxlint
```

### Backend

```bash
cd d:\task-manager-api-24it101
npm install
copy .env.example .env     # Then fill in MONGO_URI
npm start                  # node server.js → http://localhost:5000
```

- **No test command** — neither project has a test runner or test scripts.
- **No format command** — no Prettier or similar configured.
- **Both must run simultaneously** for the full app to work (frontend on :5173, backend on :5000).

### Docker (Practical 11) — one command for the whole stack

```bash
cd portfolio-24it101          # compose file lives here
docker compose config         # validate the file
docker compose up --build     # frontend :5173, backend :5000, mongodb :27017
docker compose ps             # status — mongodb must be healthy
docker compose logs -f backend
docker compose down           # stop (keeps mongo_data volume)
docker compose down -v        # stop and DELETE database data
```

No local Node, npm install, `.env`, or MongoDB install needed: the backend container gets
`MONGO_URI=mongodb://mongodb:27017/taskdb` from Compose (service name `mongodb`, not
`localhost`), while the browser keeps using `http://localhost:5000` because it runs on the host.

---

## 5. Conventions

### Naming & file organization
- **Components**: PascalCase filenames, one component per file, default exports everywhere
- **Pages**: PascalCase in `src/pages/`, components in `src/components/`
- **Backend**: Single `server.js` monolith for routes; models in `models/` directory
- **CSS**: All styles live in `src/index.css` using CSS custom properties (`:root` vars). `App.css` exists but is mostly Vite scaffold leftovers — **not actively used**

### Patterns
- **State management**: Local `useState` only — no global state library, no context
- **Data fetching**: Raw `fetch()` in `src/api.js`, called from page-level `useEffect`
- **Error handling (frontend)**: Try/catch in async handlers → `setError()` state → inline error UI with retry button
- **Error handling (backend)**: `try/catch` in every route, validation errors return 400, everything else forwarded to global error middleware returning 500
- **Toast notifications**: Inline implementation in `Projects.jsx` using `setTimeout` — no toast library
- **API client**: Hardcoded `BASE_URL = "http://localhost:5000"` in `src/api.js`
- **No environment variables on the frontend** — the API URL is a string literal
- **Backend routes**: All defined inline in `server.js`, no separate router files
- **Backend caching (Practical 9)**: `GET /tasks` and `GET /tasks/:id` use `node-cache` with 60s TTL; all write routes invalidate cache; debug stats at `GET /debug/cache-stats`
- **Backend events (Practical 10)**: POST/DELETE routes emit `task-created` / `task-deleted` on a shared EventEmitter AFTER the response is sent; listeners in `listeners.js` log notifications asynchronously (2s simulated delay) — invisible to API consumers, no frontend involvement
- **EDA timing demo (Practical 10)**: `node compare.js` in the backend repo compares inline vs event-driven response times

### Performance optimization (Practical 8)
- **Route-based code splitting**: `Projects` and `Contact` pages use `React.lazy()` + dynamic `import()`
- **Home stays static**: Landing page is always in the main bundle (loads first)
- **Suspense boundary**: Wraps only the `<Routes>` block, not the entire app
- **Fallback UI**: Uses existing `.state-container` + `.spinner` + `.state-text` CSS classes — matches the in-page loading pattern

### Style conventions
- CSS custom properties for theming (`--primary-color`, `--bg-color`, etc.)
- Design uses `.repo-card` class for card-style containers (used for both repo cards and task cards)
- Components mix CSS classes with inline `style={{}}` props — **no consistent boundary**
- Font: Poppins (300–700 weights)

---

## 6. Key Files

| File | Role |
|---|---|
| `portfolio-24it101/src/App.jsx` | Route definitions with `lazy()` + `Suspense` for code splitting (Practical 8) |
| `portfolio-24it101/src/api.js` | Single API client — all backend communication goes through here |
| `portfolio-24it101/src/pages/Projects.jsx` | Main feature page — task CRUD logic, form, list, toast, error/loading states |
| `portfolio-24it101/src/components/TaskCard.jsx` | Core interactive component — edit mode, completion toggle, delete |
| `portfolio-24it101/src/index.css` | Design system — all CSS custom properties and component styles |
| `portfolio-24it101/src/main.jsx` | App bootstrap — BrowserRouter, StrictMode, root render |
| `portfolio-24it101/Dockerfile` | Multi-stage container build — Vite build (node:22-alpine) → Nginx serve (Practical 11) |
| `portfolio-24it101/nginx.conf` | SPA fallback so React Router routes survive hard refresh (Practical 11) |
| `portfolio-24it101/docker-compose.yml` | Compose stack: frontend + backend + mongodb, network `app-network`, volume `mongo_data` (Practical 11) |
| `task-manager-api-24it101/Dockerfile` | Backend API image (Practical 11) |
| `task-manager-api-24it101/server.js` | Entire backend — middleware, all 5 REST routes + cache logic + debug endpoint + event emits, error handler |
| `task-manager-api-24it101/cache.js` | Shared `NodeCache` instance (60s TTL) — imported by `server.js` |
| `task-manager-api-24it101/events.js` | Shared EventEmitter instance — Practical 10 |
| `task-manager-api-24it101/listeners.js` | Registers task-created / task-deleted / error listeners — Practical 10 |
| `task-manager-api-24it101/compare.js` | EDA vs non-EDA timing comparison demo — Practical 10 |
| `task-manager-api-24it101/models/Task.js` | Mongoose schema — defines task shape, validation, pre-save hook |
| `task-manager-api-24it101/.env.example` | Documents required env vars for backend setup |

---

## 7. Gotchas

- **`ErrorMessage.jsx` has a bug**: A `<button>` element is placed *before* the `return` statement (line 2–4), so it's dead code that never renders. The component effectively ignores it but this would crash or be flagged if someone tried to use/fix it.
- **`NotFound.jsx` exists but is not routed**: `App.jsx` has no catch-all `<Route path="*">` — navigating to an undefined path shows a blank page.
- **Several components are unused**: `Header.jsx`, `Footer.jsx`, `About.jsx`, `Skills.jsx`, and `Spinner.jsx` are not imported anywhere in the current app. They appear to be from earlier practicals.
- **`App.css` is mostly dead code**: Contains Vite scaffold styles (`.hero`, `.counter`, `#center`, etc.) that are not referenced by any current component.
- **Hardcoded API URL**: `src/api.js` uses `http://localhost:5000` — no env var, no proxy config. Will break in any non-local deployment.
- **CORS is wide open**: Backend uses `cors()` with no origin restrictions.
- **Port is hardcoded**: Backend listens on port 5000 (line 22 of `server.js`), not read from env.
- **No PATCH endpoint**: Updates use `PUT` which replaces the full document fields sent in the body. The frontend sends `title`, `description`, and `completed` on update but doesn't send `priority`, so **priority gets silently unset on update** (set to undefined → Mongoose default `"low"`).
- **Pre-save hook vs. `findByIdAndUpdate`**: The `Task.js` pre-save hook (title trim) only fires on `.save()`, not on `findByIdAndUpdate()` used by the PUT route. So title trimming doesn't apply to updates.
- **`deleteTask` in `api.js` doesn't return JSON**: The function doesn't call `.json()` on the response — this works only because the frontend doesn't use the return value.
- **Toast implementation is basic**: No animation cleanup on unmount; rapid actions can stack toasts or cause state updates on unmounted components.
- **No input sanitization on the backend** beyond Mongoose schema validation.
- **Notifications are backend-only (Practical 10)**: task-created / task-deleted events produce console logs on the server, not user-facing toasts or extra API fields. Don't expect frontend changes when grading Practical 10.
- **Timing demo runs separately**: `compare.js` is a standalone script (`node compare.js` in the backend repo), not an endpoint — it busy-waits on purpose to simulate a blocking inline handler.
- **Import paths are case-sensitive in Docker (fixed in P11)**: `App.jsx` used to import `./components/Navbar` while the file is `NavBar.jsx`. Windows hides this; the Linux container build failed until the path matched exactly.
- **Nginx `types {}` replaces the default MIME table (P11)**: a custom `types` block drops `text/html`, making browsers download `index.html` instead of rendering the app — that's why `nginx.conf` relies on nginx's built-in mime.types.
- **Port conflicts with local dev**: running `npm start` (backend) or `npm run dev` (Vite) locally occupies 5000/5173 and blocks `docker compose up` from publishing them.
- **Two different networking cases (P11)**: Docker service names (`backend`, `mongodb`) only resolve inside `app-network`. The browser must use `http://localhost:5000`; the backend container must use `mongodb://mongodb:27017`, never `localhost`.

---

## 8. Out of Scope

- **`App.css`** — Vite scaffold boilerplate. Don't extend it; all real styles belong in `index.css`.
- **Unused components** (`Header.jsx`, `Footer.jsx`, `About.jsx`, `Skills.jsx`, `Spinner.jsx`) — Leftovers from earlier practicals. Don't integrate them without checking if they're intentionally preserved for grading.
- **`.env` file** — Contains real MongoDB Atlas credentials. Never commit, log, or modify the connection string without the owner's knowledge.
- **MongoDB Atlas cluster configuration** — Network access and DB user management is outside this codebase.
- **`package-lock.json`** — Auto-generated; don't edit manually.
- **`node_modules/`** — Git-ignored in both projects.
- **`docker compose down -v`** — deletes the `mongo_data` volume (all task data). Only use it when you intentionally want a clean database.
