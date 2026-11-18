# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM --platform=$BUILDPLATFORM node:22-alpine AS builder

WORKDIR /app

# Copy lockfiles first to leverage Docker layer caching
COPY package.json package-lock.json ./
RUN npm install --no-package-lock

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
# Pinned: 1.30.7 is the patched stable for the 2026-11 nginx CVE. A floating tag only
# picked fixes up on whatever day the image happened to be rebuilt.
FROM nginx:1.30.7-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our config and the prerendered static files
COPY nginx.conf /etc/nginx/conf.d/error-pages.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 8080
