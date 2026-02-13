import { i18n } from './i18n'
import { sdk } from './sdk'
import { apiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Maple Proxy!'))

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
    exec: { command: sdk.useEntrypoint() },
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
