# Context — Student Portfolio + Task Manager API

## 1. Project Overview

A college practical project (B.Tech IT — Milan Vadhel) split across two repositories. The **frontend** (`portfolio-24it101`) is a React single-page portfolio/dashboard that lists GitHub repos and manages tasks. The **backend** (`task-manager-api-24it101`) is a REST API built with Express + MongoDB (Mongoose) exposing CRUD endpoints for tasks. The frontend calls the backend at `http://localhost:5000`. Target audience: course instructors evaluating practical assignments.

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

### Backend (`d:\task-manager-api-24it101`)

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | — |
| Framework | Express | ^4.22.2 |
| ODM | Mongoose | ^9.9.1 |
| Database | MongoDB Atlas (cloud) | — |
| CORS | cors | ^2.8.6 |
| Env vars | dotenv | ^16.4.5 |
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

### Frontend directory structure

```
portfolio-24it101/
├── index.html              # HTML shell, loads Poppins font, mounts #root
├── vite.config.js          # Minimal Vite config — just react() plugin
├── .oxlintrc.json          # Lint rules: react hooks + export-components
├── package.json
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx            # Entry — BrowserRouter + StrictMode
    ├── App.jsx             # Top-level routes: /, /projects, /contact
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
├── server.js               # Express app — middleware, routes, error handler, listen
├── models/
│   └── Task.js             # Mongoose schema + pre-save hook + model export
├── .env                    # MONGO_URI (git-ignored)
├── .env.example            # Template for MONGO_URI
├── .gitignore              # Ignores node_modules/ and .env
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

### Style conventions
- CSS custom properties for theming (`--primary-color`, `--bg-color`, etc.)
- Design uses `.repo-card` class for card-style containers (used for both repo cards and task cards)
- Components mix CSS classes with inline `style={{}}` props — **no consistent boundary**
- Font: Poppins (300–700 weights)

---

## 6. Key Files

| File | Role |
|---|---|
| `portfolio-24it101/src/App.jsx` | Route definitions — the structural overview of all pages |
| `portfolio-24it101/src/api.js` | Single API client — all backend communication goes through here |
| `portfolio-24it101/src/pages/Projects.jsx` | Main feature page — task CRUD logic, form, list, toast, error/loading states |
| `portfolio-24it101/src/components/TaskCard.jsx` | Core interactive component — edit mode, completion toggle, delete |
| `portfolio-24it101/src/index.css` | Design system — all CSS custom properties and component styles |
| `portfolio-24it101/src/main.jsx` | App bootstrap — BrowserRouter, StrictMode, root render |
| `task-manager-api-24it101/server.js` | Entire backend — middleware, all 5 REST routes, error handler |
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

---

## 8. Out of Scope

- **`App.css`** — Vite scaffold boilerplate. Don't extend it; all real styles belong in `index.css`.
- **Unused components** (`Header.jsx`, `Footer.jsx`, `About.jsx`, `Skills.jsx`, `Spinner.jsx`) — Leftovers from earlier practicals. Don't integrate them without checking if they're intentionally preserved for grading.
- **`.env` file** — Contains real MongoDB Atlas credentials. Never commit, log, or modify the connection string without the owner's knowledge.
- **MongoDB Atlas cluster configuration** — Network access and DB user management is outside this codebase.
- **`package-lock.json`** — Auto-generated; don't edit manually.
- **`node_modules/`** — Git-ignored in both projects.
