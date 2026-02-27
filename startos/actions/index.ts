import { sdk } from '../sdk'
import { configure } from './configure'
import { proxyProperties } from './proxyProperties'

export const actions = sdk.Actions.of().addAction(configure).addAction(proxyProperties)
