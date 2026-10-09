# ─────────────────────────────────────────────
# PRACTICAL 11 — Frontend container
# Multi-stage build:
#   Stage 1 (builder) : Node.js installs deps and runs `vite build`
#   Stage 2 (runtime) : Nginx serves the generated dist/ folder
# The final image contains ONLY Nginx + the built files,
# so it stays small (no node_modules, no build tooling).
# ─────────────────────────────────────────────

# ── Stage 1: build the production bundle ────
FROM node:22-alpine AS builder

# Node 22 (>= 22.12) satisfies the engine requirement of
# Vite 8 / @vitejs/plugin-react 6: "node": "^20.19.0 || >=22.12.0"
WORKDIR /app

# Copy dependency manifests FIRST so npm's layer cache
# only invalidates when package.json / lockfile change.
# npm ci installs exactly what package-lock.json says.
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application source
COPY . .

# Run the project's existing production build script → dist/
RUN npm run build

# ── Stage 2: serve with Nginx ────────────────
FROM nginx:1.27-alpine

# Remove the default welcome page config
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/default.conf

# Copy the static production build from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config → SPA fallback so React Router
# routes (/projects, /contact) survive a hard refresh
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Nginx listens on port 80 INSIDE the container.
# Docker Compose maps host port 5173 → container port 80,
# so the app opens at http://localhost:5173
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
