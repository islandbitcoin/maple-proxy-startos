export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Maple Proxy!': 0,
  'Proxy Server': 1,
  'The proxy server is ready': 2,
  'The proxy server is not ready': 3,
  'Web UI': 4,
  'The Web UI is ready': 5,
  'The Web UI is not ready': 6,

  // interfaces.ts
  API: 7,
  'OpenAI-compatible API endpoint for Maple Proxy': 8,
  'Chat interface for Maple Proxy': 9,

  // actions/configure.ts
  Configure: 10,
  'Set your Maple API key and backend URL': 11,
  'Backend URL': 12,
  'The Maple/OpenSecret backend URL. Only change this if you are running your own backend.': 13,
  'API Key': 14,
  'Your Maple API key. If left empty, clients must provide their own key via the Authorization header.': 15,

  // init/initializeService.ts
  'Set your Maple API key': 16,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
