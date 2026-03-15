# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy lockfiles first to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our config and the prerendered static files
COPY nginx.conf /etc/nginx/conf.d/error-pages.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 8080
