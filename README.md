# Maple Proxy on StartOS

Upstream repo: [https://github.com/OpenSecretCloud/maple-proxy](https://github.com/OpenSecretCloud/maple-proxy)

A lightweight OpenAI-compatible proxy server for Maple/OpenSecret's TEE infrastructure, packaged for StartOS.

## Container Runtime

| Property      | Value                                          |
|---------------|------------------------------------------------|
| Image         | ghcr.io/opensecretcloud/maple-proxy:latest     |
| Architectures | x86_64, aarch64                                |
| Entrypoint    | /usr/local/bin/maple-proxy                     |

## Volumes

| Volume | Mount Point | Purpose         |
|--------|-------------|-----------------|
| main   | /data       | Persistent data |

## Network Interfaces

| Interface | Port | Protocol | Purpose               |
|-----------|------|----------|-----------------------|
| API       | 8080 | HTTP     | OpenAI-compatible API |

## Usage

Once installed, point any OpenAI-compatible client at your StartOS Maple Proxy address:

```python
import openai

client = openai.OpenAI(
    api_key="YOUR_MAPLE_API_KEY",
    base_url="http://<your-startos-address>:8080/v1"
)

stream = client.chat.completions.create(
    model="llama3-3-70b",
    messages=[{"role": "user", "content": "Hello!"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content is not None:
        print(chunk.choices[0].delta.content, end="")
```

## Dependencies

None.

## Backups

The main volume is backed up.

## Health Checks

| Check         | Method                | Messages                    |
|---------------|-----------------------|-----------------------------|
| API Interface | Port listening (8080) | Ready: "The API is ready"  |

## Quick Reference for AI Consumers

```yaml
package_id: maple-proxy
upstream_version: 0.1.6
image: ghcr.io/opensecretcloud/maple-proxy:latest
architectures: [x86_64, aarch64]
volumes:
  main: /data
ports:
  api: 8080
dependencies: none
actions: []
health_checks:
  - port_listening: 8080
backup_volumes:
  - main
```
