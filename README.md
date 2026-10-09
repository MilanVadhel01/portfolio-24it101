# 🎨 Portfolio — Practical 8 Frontend (24IT101)

A React single-page **portfolio + task dashboard** built with **Vite**.
It consumes the Task Manager API (`task-manager-api-24it101`) for the task CRUD features.

> 📡 **Practical 9 & 10 note:** The backend added server-side caching (node-cache) and
> event-driven async notifications (Node `events` module). **No frontend changes were
> required** — the API contract (endpoints, status codes, JSON shapes) is unchanged,
> so this repo's code is identical to Practical 8.

> 🐳 **Practical 11 note:** The app is now **containerized with Docker**. This repo
> gained a multi-stage `Dockerfile` (Vite build → Nginx), an `nginx.conf` with SPA
> fallback, a `.dockerignore`, and the `docker-compose.yml` that runs the whole
> stack (frontend + backend + MongoDB) with one command. One source fix was needed:
> `src/App.jsx` imported `./components/Navbar` but the file is `NavBar.jsx` —
> Windows hides that mistake, Linux (Docker) does not. No API or UI behavior changed.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Dev server & bundler |
| react-router-dom | Client-side routing (`/`, `/projects`, `/contact`) |
| Oxlint | Linter |
| Google Fonts (Poppins) | Typography |
| Docker / Docker Compose | Container build & orchestration (Practical 11) |
| Nginx | Serves the production `dist/` build inside the container |
| MongoDB (`mongo:7.0`) | Database (run as a Compose service) |

---

## 📁 Project Structure

```
portfolio-24it101/
├── index.html              # HTML shell, mounts #root
├── vite.config.js          # Minimal config — react() plugin
├── Dockerfile              # Multi-stage: node:22-alpine build → nginx:1.27-alpine serve (P11)
├── nginx.conf              # SPA fallback (try_files → /index.html) for React Router (P11)
├── .dockerignore           # Keeps node_modules/, .env*, .git/ out of the image (P11)
├── docker-compose.yml      # Orchestrates frontend + backend + mongodb (P11)
├── src/
│   ├── main.jsx            # Entry — BrowserRouter + StrictMode
│   ├── App.jsx             # Routes with React.lazy() + Suspense code splitting
│   ├── index.css           # Design system — CSS custom props, all styles
│   ├── api.js              # fetch client — getTasks / createTask / updateTask / deleteTask
│   ├── components/         # NavBar, TaskCard, RepoCard, etc.
│   └── pages/              # Home, Projects (task CRUD UI), Contact, NotFound
└── public/                 # Static assets
```

---

## ⚙️ Setup & Installation

### 🐳 Option A — Docker (Practical 11): start everything with one command

No local Node, npm install, or MongoDB setup needed. From this directory:

```bash
docker compose up --build     # → frontend http://localhost:5173
```

See the [Practical 11 section](#-practical-11--containerization-with-docker--docker-compose) below for details.

### Option B — Manual (original workflow)

#### 1. Clone and install

```bash
git clone https://github.com/MilanVadhel01/portfolio-24it101.git
cd portfolio-24it101
npm install
```

#### 2. Start the backend first

The Projects page needs the API running on port 5000:

```bash
cd ../task-manager-api-24it101
npm install && npm start
```

#### 3. Start the frontend

```bash
npm run dev        # → http://localhost:5173
```

---

## 🧪 Other Commands (manual mode)

| Command | Action |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint |

---

## ✨ Features

- **Home** — landing page with CTA to the projects dashboard
- **Projects** — full task CRUD (create, inline edit, toggle complete, delete) with toast notifications, loading & error states
- **Contact** — static contact form
- **Route-based code splitting** — `Projects` and `Contact` are `React.lazy()`-loaded (Practical 8)
- **Responsive design** — Poppins font, CSS custom-property theming

---

## 🐳 Practical 11 — Containerization with Docker & Docker Compose

This practical packages the existing React frontend, the Express backend, and a
MongoDB server into containers and runs them together with **one command**.
Nothing in the application code changed — Docker only changes *how it runs*.

### What Docker and Docker Compose do here

- **Docker** builds a portable image for each app (frontend, backend) from its `Dockerfile`.
- **Docker Compose** (`docker-compose.yml` in *this* repository) starts all three
  containers together, wires them onto one network, and mounts a volume for the database.

### Files added in this practical

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build: Node 22 runs `npm ci` + `vite build`, then Nginx serves `dist/` |
| `nginx.conf` | Nginx server block with **SPA fallback** (`try_files ... /index.html`) so refreshing `/projects` works |
| `.dockerignore` | Keeps `node_modules/`, `.env*`, `.git/`, `dist/`, logs out of the build context |
| `docker-compose.yml` | Orchestrates `frontend`, `backend`, `mongodb` on `app-network` with the `mongo_data` volume |

> The backend repository (`../task-manager-api-24it101`) got its own `Dockerfile`
> and `.dockerignore`. The two Git repositories stay **separate** — the Compose
> file simply uses the sibling directory as a build context.

### The three services

| Service | Image / Build | Container port | Host port | Purpose |
|---|---|---|---|---|
| `frontend` | built from `./Dockerfile` (this repo) | `80` (Nginx) | **5173** | Serves the production React bundle |
| `backend` | built from `../task-manager-api-24it101/Dockerfile` | `5000` | **5000** | Express REST API (`/tasks` CRUD, cache, events) |
| `mongodb` | `mongo:7.0` (official image) | `27017` | **27017** | Database storing the `tasks` collection |

```
Browser ──► localhost:5173 ──► frontend (Nginx :80)
Browser ──► localhost:5000 ──► backend  (Express :5000) ──► mongodb:27017 (Docker network)
```

### Networking — two different cases

1. **Frontend → Backend (browser side):** `src/api.js` keeps `http://localhost:5000`.
   The browser runs on the **host**, so it reaches the published port 5000.
   Browser JavaScript **cannot** resolve Docker service names like `backend` —
   changing the URL to `http://backend:5000` would break the app.
2. **Backend → MongoDB (container side):** Compose sets
   `MONGO_URI=mongodb://mongodb:27017/taskdb` for the backend container.
   Inside Docker, containers reach each other by **service name** (`mongodb`)
   on the `app-network` bridge network — `localhost` there would mean the
   backend container itself, which has no database. This environment variable
   overrides the `.env` file **only inside the container** (dotenv never
   overwrites existing env vars), so local development with Atlas is untouched.

### `EXPOSE` vs Compose `ports`

- `EXPOSE 5000` / `EXPOSE 80` in a Dockerfile is only **documentation** — it
  tells other images which port the container listens on. It publishes nothing.
- `ports:` in `docker-compose.yml` (`"5173:80"`, `"5000:5000"`) actually
  **forwards a host port** to the container port. Format: `HOST:CONTAINER`.
  That's why Nginx listens on 80 internally but you open `http://localhost:5173`.

### Named volume — `mongo_data`

MongoDB stores data in `/data/db`, which is mounted from the named volume
`mongo_data`. Container filesystems are throwaway — without the volume, task
data would vanish on every restart. With it, data survives `docker compose
restart` / `stop` / `up` (only `docker compose down -v` deletes it).

### Why `node_modules` is never copied from the host

The host's `node_modules` contains **native binaries for your OS** (e.g.
Windows `.node` files) and thousands of files that bloat the build context.
The image runs `npm ci` itself and installs the exact versions from
`package-lock.json` for Linux inside the container — always correct, always reproducible.

### How `.dockerignore` protects the build

`.dockerignore` filters the **build context** (the folder `docker build` uploads):

- **Secrets:** `.env` and `.env.*` never enter the image — MongoDB Atlas
  credentials cannot leak into layers or `docker history`. `.env.example` stays
  available as documentation.
- **Junk:** `node_modules/`, `dist/`, `.git/`, `npm-debug.log*`, `coverage/`
  are excluded so builds are small and cached effectively.

### Day-to-day commands

Run everything from **this** directory (`portfolio-24it101`):

```bash
# Validate the compose file without starting anything
docker compose config

# Build images and start all three containers
docker compose up --build

# Or run detached and watch logs
docker compose up --build -d
docker compose ps          # container status (healthy? up?)
docker compose logs         # all logs
docker compose logs -f backend   # follow just the API logs

# Stop / remove
docker compose down         # stop + remove containers/network (volume kept!)
docker compose down -v      # ALSO delete the mongo_data volume (destroys data)

# Rebuild after source changes
docker compose up --build
# or just one service:
docker compose build frontend
```

### Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `port is already allocated` (5000/5173/27017) | A local dev server holds the port | Stop it (e.g. the local `npm start` backend) or change the host side of `ports:` |
| Backend exits: `MongoDB connection failed` | MongoDB not ready or wrong URI | Check `docker compose ps` (mongodb must be *healthy*) and `docker compose logs mongodb` |
| Frontend loads but tasks show errors | Backend not running / CORS | `docker compose logs backend`, then `curl http://localhost:5000/tasks` |
| Refreshing `/projects` gives 404 | Nginx SPA fallback missing | Confirm `nginx.conf` is copied to `/etc/nginx/conf.d/default.conf` in the image |
| Stale code after edits | Old image layers | `docker compose up --build` (add `--no-cache` for a fully clean build) |

---

## 👤 Author

**Milan Vadhel**
GitHub: [@MilanVadhel01](https://github.com/MilanVadhel01)
