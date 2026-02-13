import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { storeJson } from '../fileModels/store.json'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  apiKey: Value.text({
    name: 'API Key',
    description:
      'Your Maple API key. If left empty, clients must provide their own key via the Authorization header.',
    warning: null,
    default: null,
    required: false,
    masked: true,
    placeholder: 'maple-api-key-...',
  }),
  backendUrl: Value.text({
    name: 'Backend URL',
    description:
      'The Maple/OpenSecret backend URL. Only change this if you are running your own backend.',
    warning: null,
    default: 'https://enclave.trymaple.ai',
    required: true,
    masked: false,
    placeholder: 'https://enclave.trymaple.ai',
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
    allowedStatuses: 'any' as const,
    group: null,
    visibility: 'enabled' as const,
  }),

  // Input spec
  inputSpec,

  // Pre-fill with current values
  async ({ effects }) => {
    const store = await storeJson.read((s) => s).once()
    return {
      apiKey: store?.apiKey ?? null,
      backendUrl: store?.backendUrl ?? 'https://enclave.trymaple.ai',
    }
  },

  // Handler
  async ({ effects, input }) => {
    await storeJson.merge(effects, {
      apiKey: input.apiKey ?? undefined,
      backendUrl: input.backendUrl,
    })

    return {
      version: '1' as const,
      title: 'Configuration Saved',
      message: 'Your Maple Proxy configuration has been updated.',
      result: {
        type: 'group' as const,
        value: [
          {
            type: 'single' as const,
            name: 'Backend URL',
            description: null,
            value: input.backendUrl,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single' as const,
            name: 'API Key',
            description: null,
            value: input.apiKey ? '••••••••' : '(not set — clients must provide their own)',
            masked: false,
            copyable: false,
            qr: false,
          },
        ],
      },
    }
  },
)
