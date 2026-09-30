# 🎨 Portfolio — Practical 8 Frontend (24IT101)

A React single-page **portfolio + task dashboard** built with **Vite**.
It consumes the Task Manager API (`task-manager-api-24it101`) for the task CRUD features.

> 📡 **Practical 9 & 10 note:** The backend added server-side caching (node-cache) and
> event-driven async notifications (Node `events` module). **No frontend changes were
> required** — the API contract (endpoints, status codes, JSON shapes) is unchanged,
> so this repo's code is identical to Practical 8.

---

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Dev server & bundler |
| react-router-dom | Client-side routing (`/`, `/projects`, `/contact`) |
| Oxlint | Linter |
| Google Fonts (Poppins) | Typography |

---

## 📁 Project Structure

```
portfolio-24it101/
├── index.html              # HTML shell, mounts #root
├── vite.config.js          # Minimal config — react() plugin
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

### 1. Clone and install

```bash
git clone https://github.com/MilanVadhel01/portfolio-24it101.git
cd portfolio-24it101
npm install
```

### 2. Start the backend first

The Projects page needs the API running on port 5000:

```bash
cd ../task-manager-api-24it101
npm install && npm start
```

### 3. Start the frontend

```bash
npm run dev        # → http://localhost:5173
```

---

## 🧪 Other Commands

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

## 👤 Author

**Milan Vadhel**
GitHub: [@MilanVadhel01](https://github.com/MilanVadhel01)
