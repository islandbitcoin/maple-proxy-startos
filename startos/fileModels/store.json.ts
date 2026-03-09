import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const MAPLE_BACKEND_URL = 'https://enclave.trymaple.ai'

const shape = z.object({
  MAPLE_BACKEND_URL: z.string().catch(MAPLE_BACKEND_URL),
  MAPLE_API_KEY: z.string().optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: 'store.json' },
  shape,
)
