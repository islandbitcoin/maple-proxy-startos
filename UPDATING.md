# Updating the upstream version

Maple Proxy ships two images: the upstream `maple-proxy` (pulled from GHCR) and a locally built `maple-ui` (from `assets/ui/`). Only the proxy has an upstream version to track; the UI is local code in this repo.

## Determining the upstream version

- **maple-proxy**: canonical home <https://github.com/OpenSecretCloud/maple-proxy>. Latest release:
  ```
  gh release view -R OpenSecretCloud/maple-proxy --json tagName -q .tagName
  ```
  The pin lives in `startos/manifest/index.ts` under `images['maple-proxy'].source.dockerTag` (currently `ghcr.io/opensecretcloud/maple-proxy:0.1.8`). The GHCR tag matches the GitHub release tag with the leading `v` stripped.

## Applying the bump

- **maple-proxy**: in `startos/manifest/index.ts`, set `images['maple-proxy'].source.dockerTag` to `ghcr.io/opensecretcloud/maple-proxy:<new version>` (no leading `v`).
