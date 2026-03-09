import { MAPLE_BACKEND_URL, storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  MAPLE_BACKEND_URL: Value.text({
    name: i18n('Backend URL'),
    description: i18n(
      'The Maple/OpenSecret backend URL. Only change this if you are running your own backend.',
    ),
    warning: null,
    default: MAPLE_BACKEND_URL,
    required: true,
    masked: false,
    placeholder: MAPLE_BACKEND_URL,
  }),
  MAPLE_API_KEY: Value.text({
    name: i18n('API Key'),
    description: i18n(
      'Your Maple API key. If left empty, clients must provide their own key via the Authorization header.',
    ),
    warning: null,
    default: null,
    required: false,
    masked: true,
    placeholder: 'maple-api-key-...',
  }),
})

export const configure = sdk.Action.withInput(
  // ID
  'configure',

  // Metadata
  async ({ effects }) => ({
    name: i18n('Configure'),
    description: i18n('Set your Maple API key and backend URL'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // Input spec
  inputSpec,

  // Pre-fill with current values
  async ({ effects }) => storeJson.read().once(),

  // Handler
  async ({ effects, input }) =>
    storeJson.merge(effects, {
      MAPLE_BACKEND_URL: input.MAPLE_BACKEND_URL,
      MAPLE_API_KEY: input.MAPLE_API_KEY ?? undefined,
    }),
)
