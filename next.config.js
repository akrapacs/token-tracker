const { PHASE_PRODUCTION_BUILD } = require('next/constants')

// Static export is only for the GitHub Pages build; `next dev` disables API routes (src/pages/api/cmc.ts) when it's set
module.exports = (phase) => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    output: phase === PHASE_PRODUCTION_BUILD ? 'export' : undefined,
    basePath: '/token-tracker',
    images: {
      unoptimized: true,
    },
  }

  return nextConfig
}
