import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { apiPort, uiPort } from '../utils'

export const proxyProperties = sdk.Action.withoutInput(
  // ID
  'proxy-properties',

  // Metadata
  async ({ effects }) => ({
    name: i18n('Proxy Properties'),
    description: i18n('Display the port numbers used by Maple Proxy'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  // Handler
  async ({ effects }) => ({
    version: '1',
    title: 'Proxy Properties',
    message: 'Current port numbers used by Maple Proxy.',
    result: {
      type: 'group',
      value: [
        {
          type: 'single',
          name: 'API Port',
          description: null,
          value: String(apiPort),
          masked: false,
          copyable: true,
          qr: false,
        },
        {
          type: 'single',
          name: 'UI Port',
          description: null,
          value: String(uiPort),
          masked: false,
          copyable: true,
          qr: false,
        },
      ],
    },
  }),
)
