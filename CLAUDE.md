# error-pages

A lightweight, themeable HTTP error pages service for Traefik/Kubernetes. Renders styled error pages for HTTP status codes (400–504) with randomized themes and witty IT messages. Designed to run as a container, with easy customization — pick a built-in theme or build your own.

## License

Apache 2.0

## Tech Stack

- **Language**: TypeScript
- **Framework**: SvelteKit 2 + Svelte 5 (runes mode — enforced globally)
- **Rendering**: `@sveltejs/adapter-static` (SSG — all pages prerendered at build time)
- **Styling**: Tailwind CSS v4 + self-contained CSS custom properties per component
- **Test framework**: Vitest (unit/component) + Playwright (E2E)
- **Package manager**: npm (yarn.lock present from scaffold, but use `npm` for all operations)
- **Node target**: 22
- **Container**: nginx:alpine serving prerendered HTML on port 8080
- **Orchestration**: Helm chart with Traefik CRDs (traefik.io/v1alpha1)

## Architecture

```
src/
  lib/
    content.ts          # Theme names, status code messages, HTTP reason phrases
  routes/
    [code]/
      +page.ts          # Load route param, pass code to page
      +page.svelte      # Error page UI — picks random theme + message on client hydration
static/                 # Static assets
charts/
  error-pages/          # Helm chart: Deployment, Service, Traefik Middleware, IngressRoute
nginx.conf              # Static serving: Traefik's /{code}.html IS the built file
Dockerfile              # Multi-stage: node:22-alpine build → nginx:alpine serve
```

### How It Works

1. SvelteKit prebuilds all 8 error code routes to static HTML under `build/`
2. nginx serves them directly — the static adapter emits flat `/{status}.html` files, which is
   exactly the path Traefik's errors middleware requests (`try_files $uri =404`, no rewrite)
3. On client-side hydration, `Math.random()` selects a theme and a funny message
4. Traefik middleware intercepts 400–599 responses and redirects to `/{status}.html`

### Status Codes

400, 401, 403, 404, 500, 502, 503, 504

### Themes

`dark` (deep slate), `retro` (amber CRT), `neon` (synthwave), `minimal` (paper)

## Development

### Prerequisites

- Node 22
- npm

### Getting Started

```sh
npm install
npm run dev
```

### Commands

| Command             | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Start dev server                 |
| `npm run build`     | Build static output to `build/`  |
| `npm run preview`   | Preview production build         |
| `npm run check`     | Run `svelte-check` type checking |
| `npm run lint`      | Prettier + ESLint check          |
| `npm run format`    | Auto-format with Prettier        |
| `npm run test:unit` | Run Vitest unit/component tests  |
| `npm run test:e2e`  | Run Playwright E2E tests         |
| `npm test`          | Run all tests                    |

## Conventions

### Svelte

- **Svelte 5 runes are mandatory** — `$props()`, `$state()`, `$derived()`, `$effect()` everywhere. The `dynamicCompileOptions` in `svelte.config.js` enforces runes mode for all non-node_modules files. Never use Svelte 4 `export let` syntax.
- Component styles are **self-contained** — no external CSS files for error page components. Use `<style>` blocks with CSS custom properties.
- Theming via `data-theme` attribute and CSS custom properties. Every theme defines the full token
  set (`--bg`, `--fg`, `--muted`, `--accent`, `--accent-2`, `--surface`, `--edge`, `--field-a`,
  `--field-b`, `--grid`, `--font-stack`) so no layout rule has to branch per theme.
- No external fonts or images: the page's own CSP is `default-src 'self'`, and an error page must
  render when everything else is degraded.
- Beware `animation-fill-mode: both` — the keyframe's end state wins over a plain `opacity` on the
  same element. Elements that settle at a non-1 opacity need their own keyframe.

### TypeScript

- Strict mode enabled via `tsconfig.json`
- All new modules in `src/lib/` should be typed

### Testing

- Unit tests live alongside source in `src/lib/vitest-examples/` pattern (colocated `.spec.ts` files)
- E2E tests in `src/routes/**/page.svelte.e2e.ts` pattern (Playwright)
- After build: verify `build/` contains 8 `{code}.html` files (one per status code)

### Git

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, etc.)
- Main branch: `main`

### Docker

- Multi-stage build: `node:22-alpine` for build, `nginx:alpine` for serve
- Target image size: < 15MB
- Port: 8080

### CI/CD

- Workflow file: `.github/workflows/release.yml`
- Triggers on `v*` tags (e.g. `v0.1.0`, `v1.0.0`)
- Gate: unit tests (`npm run check` + `npm run test:unit -- --run`) must pass before any artifact is built
- Publishes container image to `ghcr.io/wanted-cloud/error-pages:{version}` (multi-arch: `linux/amd64` + `linux/arm64`)
- Publishes Helm chart as OCI artifact to `oci://ghcr.io/wanted-cloud/error-pages:{version}`
- Chart `version` and `appVersion` in `charts/error-pages/Chart.yaml` are stamped from the git tag at publish time

## Key Files

| File                             | Purpose                                                     |
| -------------------------------- | ----------------------------------------------------------- |
| `src/lib/content.ts`             | Single source of truth for themes, messages, reason phrases |
| `src/routes/[code]/+page.svelte` | The error page component                                    |
| `src/routes/[code]/+page.ts`     | Loader — extracts `code` from params                        |
| `svelte.config.js`               | Prerender entries for all 8 codes + adapter config          |
| `nginx.conf`                     | Static serving + security headers for Traefik integration   |
| `Dockerfile`                     | Multi-stage container build                                 |
| `charts/error-pages/`            | Helm chart for Kubernetes/Traefik                           |

## Integration

### Traefik

- Traefik sends `GET /{status_code}.html` when a backend returns an error
- nginx serves that file directly — adapter-static emits flat `/{code}.html`, no rewrite needed
- Individual Ingresses opt in via: `traefik.ingress.kubernetes.io/router.middlewares: <namespace>-error-pages@kubernetescrd`
- Catch-all IngressRoute handles unregistered hosts at lowest priority

### Helm Values

```yaml
namespace: error-pages
image:
  repository: ghcr.io/wanted-cloud/error-pages
  tag: latest
theme: dark # default theme hint (actual selection is random client-side)
```

## MRLM Plugin Usage

This project uses the [mrlm devstack plugin](https://github.com/mrlm-net/devstack) for AI-assisted development. Available commands:

| Command    | What it does                                                                          |
| ---------- | ------------------------------------------------------------------------------------- |
| `/spec`    | Gather requirements, write user stories and acceptance criteria                       |
| `/design`  | Design system architecture, define interfaces and technical patterns                  |
| `/build`   | Implement code and unit tests (engineer only, no review)                              |
| `/review`  | Systematic code review for correctness, style, and performance                        |
| `/test`    | Run E2E, performance, UX, and accessibility testing                                   |
| `/secure`  | Vulnerability scan, SBOM generation, OWASP compliance check                           |
| `/deploy`  | Infrastructure provisioning and deployment automation                                 |
| `/make`    | Full SDLC pipeline — from requirements through security scan                          |
| `/ask`     | Ask any question using full agent toolkit (read-only)                                 |
| `/write`   | Generate articles, documentation, or marketing content                                |
| `/release` | Publish versioned release with changelog, git tag, and GitHub Release                 |
| `/scope`   | Plan from issue/work item or topic — analysis, design, planning, and backlog creation |
| `/init`    | Initialize project structure and CLAUDE.md                                            |

### Recommended Workflow

For new features, use the full pipeline: `/make [feature description]`

For focused work, chain individual commands:

1. `/spec` — define what to build
2. `/design` — plan how to build it
3. `/build` — implement it
4. `/review` — review the code
5. `/test` — verify it works
6. `/secure` — check for vulnerabilities
