import { i18n } from './i18n'
import { sdk } from './sdk'
import { apiPort, uiPort } from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Maple Proxy!'))

  // Read config reactively — restarts service if config changes
  const store = await storeJson.read((s) => s).const(effects)

  // Build environment variables
  const env: Record<string, string> = {
    MAPLE_HOST: '0.0.0.0',
    MAPLE_PORT: String(apiPort),
    MAPLE_BACKEND_URL: store?.backendUrl ?? 'https://enclave.trymaple.ai',
    MAPLE_ENABLE_CORS: 'true',
    RUST_LOG: 'info',
  }

  if (store?.apiKey) {
    env.MAPLE_API_KEY = store.apiKey
  }

  // Maple Proxy API daemon
  const daemons = sdk.Daemons.of(effects).addDaemon('primary', {
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
      display: i18n('API Interface'),
      gracePeriod: 10_000,
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, apiPort, {
          successMessage: i18n('The API is ready'),
          errorMessage: i18n('The API is not ready'),
        }),
    },
    requires: [],
  })

  // Web UI daemon (nginx)
  const withUi = await daemons.addDaemon('ui', {
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
    requires: ['primary'],
  })

  return withUi
})
