import { setupManifest } from '@start9labs/start-sdk'
import { short, long } from './i18n'

export const manifest = setupManifest({
  id: 'maple-proxy',
  title: 'Maple Proxy',
  license: 'MIT',
  wrapperRepo: 'https://github.com/islandbitcoin/maple-proxy-startos',
  upstreamRepo: 'https://github.com/OpenSecretCloud/maple-proxy',
  supportSite: 'https://github.com/OpenSecretCloud/maple-proxy/issues',
  marketingSite: 'https://trymaple.ai/',
  donationUrl: null,
  docsUrl:
    'https://github.com/OpenSecretCloud/maple-proxy/blob/master/README.md',
  description: { short, long },
  volumes: ['main'],
  images: {
    'maple-proxy': {
      source: { dockerTag: 'ghcr.io/opensecretcloud/maple-proxy:0.1.6' },
      arch: ['x86_64', 'aarch64'],
    },
    'maple-ui': {
      source: { dockerBuild: { workdir: 'assets/ui' } },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
