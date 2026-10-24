<p align="center">
  <img src="icon.png" alt="Maple Proxy Logo" width="21%">
</p>

# Maple Proxy on StartOS

> **Upstream docs:** <https://github.com/OpenSecretCloud/maple-proxy#readme>
>
> Everything not listed in this document should behave the same as upstream
> Maple Proxy. If a feature, setting, or behavior is not mentioned here, the
> upstream documentation is accurate and fully applicable.

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

---

## Image and Container Runtime

| Property      | Value                                            |
| ------------- | ------------------------------------------------ |
| maple-proxy   | Pre-built upstream image from GHCR               |
| maple-ui      | Custom nginx build from `assets/ui/`             |
| Architectures | x86_64, aarch64                                  |

The service runs two containers:

- **maple-proxy**: the Rust API server (upstream image, unmodified)
- **maple-ui**: nginx serving a chat web UI and reverse-proxying `/v1/*` to the API

---

## Volume and Data Layout

| Volume | Mount Point | Purpose              |
| ------ | ----------- | -------------------- |
| `main` | `/data`     | All Maple Proxy data |

**Key paths on the `main` volume:**

- `store.json`: persists API key and backend URL configuration

---

## Installation and First-Run Flow

| Step      | Upstream                    | StartOS                              |
| --------- | --------------------------- | ------------------------------------ |
| Install   | `docker run`                | Sideload or install from marketplace |
| Configure | Environment variables       | StartOS **Configure** action         |
| First run | Set `MAPLE_API_KEY` env var | Action prompt to set API key         |

On first install, `store.json` is seeded with default values and a task is created prompting you to configure your Maple API key.

---

## Configuration Management

All configuration is managed through the **Configure** action in the StartOS UI.

| Setting     | Description                                                   | Default                       |
| ----------- | ------------------------------------------------------------- | ----------------------------- |
| API Key     | Your Maple API key (optional; clients can provide their own) | _(empty)_                     |
| Backend URL | The Maple/OpenSecret backend URL                              | `https://enclave.trymaple.ai` |

Configuration is stored in `store.json` on the `main` volume and read by the maple-proxy binary at startup.

---

## Network Access and Interfaces

| Interface | Type  | Port | Protocol | Description                    |
| --------- | ----- | ---- | -------- | ------------------------------ |
| API       | `api` | 8080 | HTTP     | OpenAI-compatible API endpoint |
| Web UI    | `ui`  | 80   | HTTP     | Chat interface for Maple Proxy |

**API endpoints:**

- `POST /v1/chat/completions`: chat completions (streaming supported)
- `GET /v1/models`: list available models
- `POST /v1/embeddings`: text embeddings
- `GET /health`: health check

---

## Actions (StartOS UI)

### Configure

| Property | Value |
|----------|-------|
| ID | `configure` |
| Availability | Any status |
| Visibility | Enabled |

**Inputs:**

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| Backend URL | Text | Yes | `https://enclave.trymaple.ai` | Maple/OpenSecret backend URL |
| API Key | Text (masked) | No | _(empty)_ | Your Maple API key; if empty, clients must provide their own via Authorization header |

**Output:** None (service restarts to apply new configuration)

---

## Dependencies

None.

---

## Backups and Restore

The `main` volume is included in backups, preserving your `store.json` configuration.

---

## Health Checks

| Check        | Daemon         | Method                | Display        |
| ------------ | -------------- | --------------------- | -------------- |
| Proxy Server | `maple-proxy`  | Port listening (8080) | Proxy Server   |
| Web UI       | `ui`           | Port listening (80)   | Web UI         |

---

## Limitations and Differences

1. **Configuration via action only**: upstream uses environment variables directly; on StartOS, all configuration is managed through `store.json` via the Configure action
2. **Bundled web UI**: StartOS adds a custom nginx chat interface not included in the upstream project
3. **StartOS networking**: uses StartOS multi-host interfaces instead of direct port binding

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
images:
  maple-proxy: ghcr.io/opensecretcloud/maple-proxy (upstream, unmodified)
  maple-ui: custom nginx build (assets/ui/)
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  api: 8080
  ui: 80
dependencies: none
startos_managed_env_vars:
  - MAPLE_HOST
  - MAPLE_PORT
  - MAPLE_ENABLE_CORS
  - RUST_LOG
  - MAPLE_BACKEND_URL (user-configurable via action)
  - MAPLE_API_KEY (user-configurable via action)
actions:
  - configure
health_checks:
  - port_listening: 8080 (maple-proxy)
  - port_listening: 80 (maple-ui)
backup_volumes:
  - main
```
