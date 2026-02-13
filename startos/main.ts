import { i18n } from './i18n'
import { sdk } from './sdk'
import { apiPort } from './utils'
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

  return sdk.Daemons.of(effects).addDaemon('primary', {
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
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, apiPort, {
          successMessage: i18n('The API is ready'),
          errorMessage: i18n('The API is not ready'),
        }),
    },
    requires: [],
  })
})
