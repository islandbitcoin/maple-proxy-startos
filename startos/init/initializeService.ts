import { configure } from '../actions/configure'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const initializeService = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  // Seed store with defaults
  await storeJson.merge(effects, {})

  // Prompt user to configure their API key
  await sdk.action.createOwnTask(effects, configure, 'important', {
    reason: i18n('Set your Maple API key'),
  })
})
