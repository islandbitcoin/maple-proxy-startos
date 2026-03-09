import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { apiPort, uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Maple Proxy!'))

  // Read config reactively — restarts service if config changes
  const store = await storeJson.read().const(effects)
  if (!store) {
    throw new Error('No store.json')
  }
  const { MAPLE_BACKEND_URL, MAPLE_API_KEY } = store

  // Build environment variables
  const env: Record<string, string> = {
    MAPLE_HOST: '0.0.0.0',
    MAPLE_PORT: String(apiPort),
    MAPLE_BACKEND_URL,
    MAPLE_ENABLE_CORS: 'true',
    RUST_LOG: 'info',
  }
  if (MAPLE_API_KEY) {
    env.MAPLE_API_KEY = MAPLE_API_KEY
  }

  // Maple Proxy API daemon
  return sdk.Daemons.of(effects)
    .addDaemon('maple-proxy', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'maple-proxy' },
        sdk.Mounts.of().mountVolume({
          volumeId: 'main',
          subpath: null,
          mountpoint: '/data',
          readonly: false,
        }),
        'maple-proxy-sub',
      ),
      exec: {
        command: sdk.useEntrypoint(),
        env,
      },
      ready: {
        display: i18n('Proxy Server'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, apiPort, {
            successMessage: i18n('The proxy server is ready'),
            errorMessage: i18n('The proxy server is not ready'),
          }),
      },
      requires: [],
    })
    .addDaemon('ui', {
      subcontainer: await sdk.SubContainer.of(
        effects,
        { imageId: 'maple-ui' },
        null,
        'maple-ui-sub',
      ),
      exec: {
        command: ['nginx', '-g', 'daemon off;'],
      },
      ready: {
        display: i18n('Web UI'),
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: i18n('The Web UI is ready'),
            errorMessage: i18n('The Web UI is not ready'),
          }),
      },
      requires: ['maple-proxy'],
    })
})
