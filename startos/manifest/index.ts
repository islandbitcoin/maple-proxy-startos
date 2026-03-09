import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'maple-proxy',
  title: 'Maple Proxy',
  license: 'MIT',
  packageRepo:
    'https://github.com/islandbitcoin/maple-proxy-startos/tree/update/040',
  upstreamRepo: 'https://github.com/OpenSecretCloud/maple-proxy',
  marketingUrl: 'https://trymaple.ai/',
  donationUrl: null,
  docsUrls: [
    'https://github.com/OpenSecretCloud/maple-proxy/blob/master/README.md',
  ],
  description: { short, long },
  volumes: ['main'],
  images: {
    'maple-proxy': {
      source: { dockerTag: 'ghcr.io/opensecretcloud/maple-proxy:0.1.7' },
      arch: ['x86_64', 'aarch64'],
    },
    'maple-ui': {
      source: { dockerBuild: { workdir: 'assets/ui' } },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
