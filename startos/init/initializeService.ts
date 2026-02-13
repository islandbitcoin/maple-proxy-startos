import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'
import { configure } from '../actions/configure'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  // Seed store with defaults
  await storeJson.write(effects, {
    apiKey: undefined,
    backendUrl: 'https://enclave.trymaple.ai',
  })

  // Prompt user to configure their API key
  await sdk.action.createOwnTask(effects, configure, 'important', {
    reason: i18n('Set your Maple API key'),
  })
})
