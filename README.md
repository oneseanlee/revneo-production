# Revneo VibeCoder

Revneo VibeCoder is a full‑stack AI build platform that turns natural language prompts into fully deployed web apps on Cloudflare. The UI, brand palette, and workflows are tailored to Revneo’s identity while keeping the production‑grade capabilities from the original Vibe SDK reference.

## Why Revneo VibeCoder

- **Prompt → Production** – Conversations in the chat IDE drive a multi‑stage generation pipeline (blueprint → file edits → preview → deploy).
- **Realtime sandboxes** – Each app runs in Cloudflare Containers for isolated previews before promotion to Workers for Platforms.
- **Multi‑provider AI** – Gemini via Google AI Studio plus OpenAI/Anthropic/etc. behind a pluggable inference layer.
- **Revneo design system** – Updated gradients, logos, and layout components so the entire experience reflects the brand seen in the new “R” logo.
- **Ops ready** – Rate limiting, CSRF, Sentry hooks, platform status, and production deploy scripts are already wired.

## High‑Level Architecture

| Layer | Description |
| --- | --- |
| **Web App** | React 19 + Vite + Tailwind, router‑driven dashboard/chat, Monaco editors, and telemetry hooks. |
| **Worker API** | Hono application running in Cloudflare Workers with Durable Objects for agent orchestration and rate limiting. |
| **Sandbox + Deploy** | Container DO stubs manage temporary environments; dispatcher namespaces host permanent Workers for Platforms deployments. |
| **Data plane** | D1 (Drizzle ORM) for users/apps/sessions, KV for caches, R2 for template bundles, Cloudflare AI Gateway for LLM routing. |
| **Automation** | `scripts/setup.ts` for provisioning, `scripts/deploy.ts` for CI builds, and wrangler config bundling every binding. |

## Tech Stack Summary

- **Frontend**: React 19, React Router 7, Tailwind, framer‑motion, Radix UI, Monaco, Sonner toasts.
- **Backend**: Cloudflare Workers, Hono, Durable Objects, Cloudflare Containers, Wrangler.
- **Data/Infra**: D1 + Drizzle ORM, KV, R2, Dispatch namespaces, Cloudflare Images, AI Gateway.
- **AI**: Gemini (Google AI Studio), OpenAI, Anthropic, OpenRouter, Groq, Cerebras (configurable per agent action).
- **Tooling**: Vite (Rolldown), Vitest, ESLint, Prettier, tsx launcher, Bun-compatible scripts.

## Getting Started

### 1. Bootstrap the workspace

```bash
npm install              # or bun install
npm run setup            # guides Cloudflare credentials, domains, AI keys
npm run db:generate      # build Drizzle migrations
```

The setup script provisions:

- KV namespaces, D1 database, R2 template bucket, dispatcher namespaces
- Required secrets (`GOOGLE_AI_STUDIO_API_KEY`, `OPENAI_API_KEY`, etc.)
- `.dev.vars` / `.prod.vars` files plus wrangler updates for Revneo defaults

### 2. Local development

```bash
npm run dev
```

- Uses the `scripts/dev.ts` launcher to ensure `DEV_MODE=true` across Windows/macOS/Linux.
- Wrangler runs in local mode (`remoteBindings: false`, `enable_containers: false`) so no Cloudflare session is needed for UI work.
- Visit the printed Vite port (often `http://localhost:5173`, auto‑bumps if occupied).

### 3. Running tests and lint

```bash
npm run lint
npm run test
```

### 4. Deploying to Cloudflare

CI (or the dashboard Git integration) executes:

```bash
bun run build
bun run deploy
```

`scripts/deploy.ts` handles asset build, dispatcher uploads, container image pushes, and secret verification. When committing to the production repo (`oneseanlee/revneo-production`), Cloudflare Builds kicks off automatically.

## Configuration & Secrets

Key environment variables (set via Wrangler or `.dev.vars`):

| Variable | Purpose |
| --- | --- |
| `CUSTOM_DOMAIN` / `CUSTOM_PREVIEW_DOMAIN` | Main UI + preview hostname. |
| `GOOGLE_AI_STUDIO_API_KEY` | Gemini models for builder/assistant steps. |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENROUTER_API_KEY`, `GROQ_API_KEY`, `CEREBRAS_API_KEY` | Optional providers. |
| `SANDBOX_INSTANCE_TYPE`, `MAX_SANDBOX_INSTANCES`, `ALLOCATION_STRATEGY` | Container scaling knobs. |
| `TEMPLATES_REPOSITORY`, `R2`/`KV`/`DISPATCH_NAMESPACE` IDs | Template + deployment plumbing. |
| `GITHUB_*` secrets | OAuth + exporter tokens for repo sync. |
| `JWT_SECRET`, `SECRETS_ENCRYPTION_KEY`, `WEBHOOK_SECRET` | Auth/security primitives. |

## Brand & UI Notes

- Palette variables in `src/index.css` define both light and dark themes (blue → violet gradients matching the Revneo “R” logo).
- `src/components/layout/global-header.tsx` contains the custom header without external “Deploy/Fork” promos.

## Deployment Checklist

1. Fork or clone `oneseanlee/revneo-production`.
2. Install dependencies and run `npm run setup` with production account credentials.
3. Commit changes and push to a branch (e.g., `feature/logo-theme`).
4. Open a pull request back to `oneseanlee/revneo-production/main`.
5. Once merged, Cloudflare Builds (configured in the dashboard) runs `bun run build` / `bun run deploy` and propagates the new bundle.

## Contributing / Fork Workflow

- Use feature branches for every change (e.g., `feature/ai-provider`).
- Run `npm run lint && npm run test` before pushing.
- Keep `package-lock.json` committed so the Cloudflare build uses identical versions.
- If you forked (e.g., `Hawky1/revneo-production`), push to the fork and open a PR upstream—CI/CD will run after merge.

## Support

Questions, ideas, or bug reports? Open an issue in the upstream repo or contact the Revneo platform team. Pull requests that improve the agent flows, sandbox orchestration, or UI polish are always welcome.
