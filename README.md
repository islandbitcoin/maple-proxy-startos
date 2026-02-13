<p align="center">
  <img src="icon.png" alt="Maple Proxy Logo" width="21%">
</p>

# Maple Proxy on StartOS

> **Upstream docs:** <https://github.com/OpenSecretCloud/maple-proxy#readme>
>
> Everything not listed in this document should behave the same as upstream
> Maple Proxy v0.1.6. If a feature, setting, or behavior is not mentioned
> here, the upstream documentation is accurate and fully applicable.

[Maple Proxy](https://github.com/OpenSecretCloud/maple-proxy) is a lightweight OpenAI-compatible proxy server for [Maple/OpenSecret's](https://trymaple.ai/) TEE (Trusted Execution Environment) infrastructure. It provides privacy-preserving AI inference through secure enclaves.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Dependencies](#dependencies)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Limitations and Differences](#limitations-and-differences)
- [What Is Unchanged from Upstream](#what-is-unchanged-from-upstream)
- [Contributing](#contributing)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property | Value |
|----------|-------|
| maple-proxy | `ghcr.io/opensecretcloud/maple-proxy:0.1.6` (pre-built) |
| maple-ui | `nginx:stable-alpine` (custom build from `assets/ui/`) |
| Architectures | x86_64, aarch64 |

The service runs two containers:
- **maple-proxy** — the Rust API server (upstream image, unmodified)
- **maple-ui** — nginx serving a chat web UI and reverse-proxying `/v1/*` to the API

---

## Volume and Data Layout

| Volume | Mount Point | Purpose |
|--------|-------------|---------|
| `main` | `/data` | All Maple Proxy data |

**Key paths on the `main` volume:**

- `store.json` — persists API key and backend URL configuration

---

## Installation and First-Run Flow

| Step | Upstream | StartOS |
|------|----------|---------|
| Install | `docker run` | Sideload or install from marketplace |
| Configure | Environment variables | StartOS **Configure** action |
| First run | Set `MAPLE_API_KEY` env var | Action prompt to set API key |

On first install, `store.json` is seeded with default values and a task is created prompting you to configure your Maple API key.

---

## Configuration Management

All configuration is managed through the **Configure** action in the StartOS UI.

| Setting | Description | Default |
|---------|-------------|---------|
| API Key | Your Maple API key (optional — clients can provide their own) | *(empty)* |
| Backend URL | The Maple/OpenSecret backend URL | `https://enclave.trymaple.ai` |

Configuration is stored in `store.json` on the `main` volume and read by the maple-proxy binary at startup.

---

## Network Access and Interfaces

| Interface | Type | Port | Protocol | Description |
|-----------|------|------|----------|-------------|
| API | `api` | 8080 | HTTP | OpenAI-compatible API endpoint |
| Web UI | `ui` | 80 | HTTP | Chat interface for Maple Proxy |

**API endpoints:**
- `POST /v1/chat/completions` — chat completions (streaming supported)
- `GET /v1/models` — list available models
- `POST /v1/embeddings` — text embeddings
- `GET /health` — health check

---

## Actions (StartOS UI)

| Action | Description | Allowed States |
|--------|-------------|----------------|
| Configure | Set API key and backend URL | Any |

---

## Dependencies

None.

---

## Backups and Restore

The `main` volume is included in backups, preserving your `store.json` configuration.

---

## Health Checks

| Check | Daemon | Method | Grace Period |
|-------|--------|--------|--------------|
| API Interface | `primary` | Port listening (8080) | 10s |
| Web Interface | `ui` | Port listening (80) | — |

---

## Limitations and Differences

| Area | Upstream | StartOS |
|------|----------|---------|
| Configuration | Environment variables | `store.json` via Configure action |
| Web UI | Not included | Bundled nginx chat interface |
| Networking | Direct port binding | StartOS multi-host interfaces |

---

## What Is Unchanged from Upstream

- All API endpoints behave identically
- Model routing and TEE integration
- Streaming support
- API key authentication

---

## Contributing

To build locally:

```bash
npm install
npm run build
make          # builds both x86_64 and aarch64 s9pk packages
make arm      # aarch64 only
make x86      # x86_64 only
```

Requires [start-cli](https://github.com/Start9Labs/start-os) v0.4.0+ and Docker.

---

## Quick Reference for AI Consumers

```yaml
package_id: maple-proxy
upstream_version: 0.1.6
wrapper_version: 0.4-beta.1
images:
  maple-proxy: ghcr.io/opensecretcloud/maple-proxy:0.1.6
  maple-ui: nginx:stable-alpine (custom)
architectures: [x86_64, aarch64]
volumes:
  main: /data
interfaces:
  api:
    port: 8080
    type: api
    endpoints: [/v1/chat/completions, /v1/models, /v1/embeddings, /health]
  ui:
    port: 80
    type: ui
dependencies: none
actions: [configure]
health_checks:
  primary: { port_listening: 8080, grace_period: 10s }
  ui: { port_listening: 80 }
backup_volumes: [main]
```
