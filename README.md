# error-pages

Lightweight, themeable HTTP error pages service for Traefik and Kubernetes.

## What It Does

`error-pages` intercepts HTTP error responses from your backend services and replaces them with styled, human-readable error pages. When Traefik's [errors middleware](https://doc.traefik.io/traefik/middlewares/http/errorpages/) receives a 4xx or 5xx response, it forwards the request to this service, which returns a prerendered HTML page styled with one of four themes and a randomly selected witty message.

All pages are prerendered at build time using SvelteKit's static adapter — there is no runtime server-side rendering. The container is a single nginx:alpine instance serving static files, which keeps the image under 15MB and startup time under a second.

## Status Codes

| Code | Reason Phrase         | Sample Message                                     |
| ---- | --------------------- | -------------------------------------------------- |
| 400  | Bad Request           | `Even the parser threw its hands up.`              |
| 401  | Unauthorized          | `401: The bouncer says no.`                        |
| 403  | Forbidden             | `You're logged in. You're just not welcome here.`  |
| 404  | Not Found             | `The page is in another castle.`                   |
| 500  | Internal Server Error | `git blame is running. Silence fills the room.`    |
| 502  | Bad Gateway           | `We knocked. Nobody answered.`                     |
| 503  | Service Unavailable   | `Back in five minutes. (Estimate not guaranteed.)` |
| 504  | Gateway Timeout       | `Somewhere, a slow database query is to blame.`    |

Messages are selected randomly on client-side hydration. Each code has 4–7 options defined in [`src/lib/content.ts`](src/lib/content.ts).

## Themes

| Theme     | Personality                                        |
| --------- | -------------------------------------------------- |
| `dark`    | Moody, dark backgrounds with muted accents         |
| `retro`   | Cyberpunk-inspired with high-contrast neon on dark |
| `neon`    | Vibrant, high-energy color palette                 |
| `minimal` | Clean, light, distraction-free                     |

Theme selection is random on each page load. All four themes are available for every status code without any configuration.

## Quick Start

Run the container locally to see the error pages in a browser:

```sh
docker run --rm -p 8080:8080 ghcr.io/mrlm-net/error-pages:latest
```

Then open any of the prerendered pages:

```
http://localhost:8080/404.html
http://localhost:8080/500.html
http://localhost:8080/503.html
```

Refresh to cycle through random themes and messages.

## Traefik Integration

### How It Works

Traefik's `errors` middleware intercepts responses with status codes in a configured range and proxies the request to a separate service. `error-pages` is designed specifically for this pattern.

When a backend returns a 4xx or 5xx response, Traefik sends a request to `/{status}.html` on the error-pages service. nginx serves the corresponding prerendered file directly.

### Attaching the Middleware to an Ingress

Add the middleware annotation to any Ingress resource you want to enable error pages for:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: error-pages-error-pages@kubernetescrd
spec:
  rules:
    - host: my-app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app
                port:
                  number: 80
```

The annotation format is `<namespace>-<middleware-name>@kubernetescrd`. With the default Helm values, this is `error-pages-error-pages@kubernetescrd`.

### What Traefik Sends

Traefik replaces `{status}` in the `query` pattern with the actual HTTP status code. The middleware is configured as:

```yaml
spec:
  errors:
    status:
      - '400-599'
    query: '/{status}.html'
    service:
      name: error-pages
      port: 8080
```

This covers the full 4xx and 5xx range. The service only has prerendered pages for the [eight codes listed above](#status-codes) — any other code in the range falls back to nginx's built-in 404 handling, which serves the prerendered `404.html`.

### Catch-All IngressRoute

The Helm chart also deploys a Traefik `IngressRoute` with `PathPrefix("/")` at the lowest priority (`1`). This catches requests to unregistered hostnames and returns the appropriate error page instead of Traefik's default response.

## Helm Chart

### Install

The GitHub Actions workflow publishes both the container image and the Helm chart to `ghcr.io` on each `v*` tag. You can install directly from the OCI registry or from source.

```sh
# Install from OCI registry (published with each release)
helm install error-pages oci://ghcr.io/wanted-cloud/charts/error-pages --version 0.1.1 --namespace error-pages --create-namespace

# Or install from source
helm install error-pages ./charts/error-pages --namespace error-pages --create-namespace
```

To use a specific image tag when installing from source:

```sh
helm install error-pages ./charts/error-pages \
  --namespace error-pages \
  --create-namespace \
  --set image.tag=1.0.0
```

### Values Reference

| Value                       | Default                        | Description                                                           |
| --------------------------- | ------------------------------ | --------------------------------------------------------------------- |
| `namespace`                 | _(release namespace)_          | Kubernetes namespace for all resources                                |
| `image.repository`          | `ghcr.io/mrlm-net/error-pages` | Container image repository                                            |
| `image.tag`                 | `latest`                       | Image tag to deploy                                                   |
| `image.pullPolicy`          | `IfNotPresent`                 | Kubernetes image pull policy                                          |
| `replicaCount`              | `1`                            | Number of pod replicas                                                |
| `resources.requests.cpu`    | `10m`                          | CPU request                                                           |
| `resources.requests.memory` | `16Mi`                         | Memory request                                                        |
| `resources.limits.cpu`      | `100m`                         | CPU limit                                                             |
| `resources.limits.memory`   | `32Mi`                         | Memory limit                                                          |
| `middleware.name`           | `error-pages`                  | Name of the Traefik `Middleware` CRD                                  |
| `ingressRoute.entryPoints`  | `[web, websecure]`             | Traefik entry points for the catch-all `IngressRoute`                 |
| `ingressRoute.priority`     | `1`                            | Route match priority — keep this low so real services take precedence |

> **Note:** The middleware annotation on other Ingresses must match the deployed namespace and middleware name. With defaults: `error-pages-error-pages@kubernetescrd`.

## Development

### Prerequisites

- Node 22
- npm

### Getting Started

```sh
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`. Navigate to `/404` or any supported status code path to see the error page.

### Commands

| Command             | Purpose                                          |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start Vite dev server with HMR                   |
| `npm run build`     | Prerender all pages to `build/`                  |
| `npm run preview`   | Serve the production build locally               |
| `npm run check`     | Run `svelte-check` type checking                 |
| `npm run lint`      | Check formatting (Prettier) and linting (ESLint) |
| `npm run format`    | Auto-format all files with Prettier              |
| `npm run test:unit` | Run Vitest unit and component tests              |
| `npm run test:e2e`  | Run Playwright end-to-end tests                  |
| `npm test`          | Run all tests (unit + E2E)                       |

### How Themes Work

Themes are defined as string literals in `src/lib/content.ts`:

```ts
export type ThemeName = 'dark' | 'retro' | 'neon' | 'minimal';
export const THEMES: readonly ThemeName[] = ['dark', 'retro', 'neon', 'minimal'];
```

Each theme maps to a `data-theme` attribute value on the root element. CSS custom properties (`--bg`, `--fg`, `--muted`, `--accent`) are scoped per theme in the component's `<style>` block. On client-side hydration, the page component calls `Math.random()` to select a theme from the array and applies it.

To add a new theme:

1. Add the theme name to `ThemeName` and `THEMES` in `src/lib/content.ts`
2. Add a `[data-theme="your-theme"]` block to the `<style>` section of `src/routes/[code]/+page.svelte` with values for `--bg`, `--fg`, `--muted`, and `--accent`

### How to Add a New Status Code

1. Add the code string to `StatusCode`, `STATUS_CODES`, `reasonPhrases`, and `messages` in `src/lib/content.ts`
2. Add the code to the `entries` array in `svelte.config.js` so SvelteKit prebuilds the route
3. Run `npm run build` and verify a new directory appears under `build/`

The dynamic route `src/routes/[code]/` handles all codes — no new route files are needed.

## Building the Container

```sh
docker build -t error-pages:local .
```

The build uses two stages:

1. `node:22-alpine` — installs dependencies and runs `npm run build` to produce static HTML under `build/`
2. `nginx:alpine` — copies `nginx.conf` and the prerendered files; no Node runtime in the final image

Expected image size: **under 15MB**.

To verify the output before building the container:

```sh
npm run build
ls build/
# Expect: 400  401  403  404  500  502  503  504
```

## Architecture

### Request Flow

```
Browser / Client
      │
      ▼
  Traefik (IngressRoute + errors middleware)
      │  backend returns 4xx/5xx
      ▼
  GET /{status}.html  →  error-pages Service (port 8080)
      │
      ▼
  nginx:alpine
      │  serves prerendered static file
      ▼
  /{status}.html  (SvelteKit SSG output)
      │
      ▼
  Client-side hydration — random theme + message applied
```

### File Layout

```
src/
  lib/
    content.ts              # Single source of truth: themes, messages, reason phrases
  routes/
    [code]/
      +page.ts              # Extracts status code from route param
      +page.svelte          # Error page UI — applies random theme and message
static/                     # Static assets (favicon, etc.)
charts/
  error-pages/
    Chart.yaml              # Helm chart metadata
    values.yaml             # Default values
    templates/
      deployment.yaml       # Kubernetes Deployment
      service.yaml          # ClusterIP Service on port 8080
      middleware.yaml       # Traefik Middleware CRD (errors: 400-599)
      ingressroute.yaml     # Catch-all IngressRoute at priority 1
nginx.conf                  # Static file serving config; disables server_tokens
Dockerfile                  # Multi-stage: node:22-alpine build → nginx:alpine serve
svelte.config.js            # Static adapter + prerender entries for all 8 codes
```

### Key Design Decisions

- **SSG only** — no runtime rendering means zero Node.js in production and no cold-start latency. Error pages are always available even if other services are degraded.
- **Client-side randomization** — themes and messages vary per page load without server state or cookies, keeping the static build simple and CDN-friendly.
- **nginx serves flat files** — Traefik sends `/{status}.html`; nginx serves the file directly with no rewrite rules needed.

## Contributing

Pull requests are welcome. For significant changes, open an issue first to discuss what you want to change.

To run the full test suite before submitting:

```sh
npm run lint
npm run check
npm test
```

All code follows the conventions in [CLAUDE.md](CLAUDE.md): Svelte 5 runes, TypeScript strict mode, and Conventional Commits for commit messages.

## License

Apache 2.0 — see [LICENSE](LICENSE) for details.
