# Maple Proxy

## Documentation

- [Maple Proxy README](https://github.com/OpenSecretCloud/maple-proxy/blob/master/README.md): the upstream project overview and configuration reference.

## What you get on StartOS

Maple Proxy runs as two containers on StartOS: the Rust API server (upstream image) and a bundled nginx-based chat web UI. It exposes two interfaces:

- **API**: an OpenAI-compatible endpoint (`/v1/chat/completions`, `/v1/models`, `/v1/embeddings`) you can point any OpenAI-compatible client at.
- **Web UI**: a built-in chat client that talks to the API for you, so you can use Maple without configuring a separate client.

Your API key and backend URL are stored on the package's data volume and survive restarts, updates, and backups.

## Getting set up

1. Open Maple Proxy's **Actions** tab and run **Configure**.
2. Leave **Backend URL** at its default (`https://enclave.trymaple.ai`) unless you operate your own Maple/OpenSecret backend.
3. Optionally paste your Maple **API Key**. You can leave this empty if you want each client to supply its own key via the `Authorization` header.
4. Start the service. The Web UI and API interfaces become reachable from the **Dashboard** tab.

## Using Maple Proxy

### Web UI

Open the **Web UI** interface from the Dashboard to chat through your local Maple instance. It uses the API key and backend you configured.

### API

Use the **API** interface address with any OpenAI-compatible client. Point the client's base URL at the API interface address and use your configured Maple API key (or supply one per-request via the `Authorization` header).

### Configure action

Run **Configure** any time to change your API key or backend URL. The service restarts to pick up the new values.
