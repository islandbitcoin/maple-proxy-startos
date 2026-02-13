export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Maple Proxy!': 0,
  'API Interface': 1,
  'The API is ready': 2,
  'The API is not ready': 3,

  // interfaces.ts
  API: 4,
  'OpenAI-compatible API endpoint for Maple Proxy': 5,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
