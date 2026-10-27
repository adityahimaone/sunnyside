import withBundleAnalyzerInit from '@next/bundle-analyzer'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Run the server from a traced bundle in .next/standalone instead of from the
  // full node_modules. `next start` reads most of node_modules at boot; the
  // standalone bundle is only what the server actually touches, which is a
  // large cut in resident memory on a 1.9GB host. ecosystem.config.js points
  // PM2 at .next/standalone/server.js for this reason -- `next start` refuses to
  // work with this setting.
  //
  // Disabled: the site now deploys to Cloudflare Workers via OpenNext, and the
  // adapter builds its own worker bundle. `output: 'standalone'` also made
  // `next start` and the PM2 target mutually incompatible, which is what left
  // PM2 crash-looping on a stale config. Set CF_DEPLOY=1 if the VPS copy needs
  // to be rebuilt for rollback.
  ...(process.env.CF_DEPLOY === '1' ? { output: 'standalone' } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
    // Build-time only, nothing here reaches the running server. The host has
    // 1.9GB total and builds run on it during deploy, so the defaults -- one
    // worker per core, and static generation fanned out across them -- drove
    // peak RSS high enough to swap. Pinning both trades build wall-clock for a
    // build that fits. Measured knobs, not guesses: raise `cpus` first if the
    // build gets slow, and only drop `staticGenerationMaxConcurrency` below 4
    // if generation is what peaks rather than compilation.
    cpus: 1,
    staticGenerationMaxConcurrency: 2,
  },
  images: {
    // The /_next/image optimizer needs a long-lived Node process with sharp,
    // which Workers do not have. Serving the source file directly is the
    // documented OpenNext approach; format/TTL settings below no longer apply
    // and the source images are already WebP.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.gifer.com' },
      { protocol: 'https', hostname: 'images.ctfassets.net' },
      { protocol: 'https', hostname: 'camo.githubusercontent.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
    // WebP only, no AVIF. AVIF saves maybe 20% on file size but costs several
    // times the encode CPU and transient memory per image, paid inside the
    // request that triggers the optimization. That tradeoff is backwards on
    // this host: covers and the site-wide noise texture are the largest images
    // served, and they were what drove optimizer spikes. Every browser in the
    // project's browserslist decodes WebP.
    formats: ['image/webp'],
    // The default 60s revalidates a stable asset on every crawl. Nothing here
    // is content-hashed by query string, so a week is safe.
    minimumCacheTTL: 604800,
  },
  // Canonical single-hop redirects for legacy routes, folded content, and missing endpoints.
  // Direct destinations prevent 308 redirect chains (e.g. trailing slash normalization).
  async redirects() {
    return [
      // Media & legacy versions
      { source: '/spotify', destination: '/music', permanent: true },
      { source: '/v2', destination: '/', permanent: true },
      { source: '/classic', destination: '/', permanent: true },
      { source: '/classic/', destination: '/', permanent: true },

      // Folded content & anchor sections (one direct hop for clean and trailing slash)
      { source: '/about', destination: '/#about', permanent: true },
      { source: '/about/', destination: '/#about', permanent: true },
      { source: '/contact', destination: '/#contact', permanent: true },
      { source: '/contact/', destination: '/#contact', permanent: true },
      { source: '/work', destination: '/projects', permanent: true },
      { source: '/work/', destination: '/projects', permanent: true },
      { source: '/experience', destination: '/#about', permanent: true },
      { source: '/experience/', destination: '/#about', permanent: true },
      { source: '/guides', destination: '/blog', permanent: true },
      { source: '/guides/', destination: '/blog', permanent: true },

      // Legacy notes mappings to canonical blog posts
      {
        source: '/notes/9router',
        destination: '/blog/9router-ai-gateway-60plus-providers',
        permanent: true,
      },
      {
        source: '/notes/frontend-2026',
        destination: '/blog/frontend-development-2026',
        permanent: true,
      },
      {
        source: '/notes/vps-deploy-nextjs',
        destination: '/blog/deploy-nextjs-vps-nginx-pm2-custom-domain',
        permanent: true,
      },
      {
        source: '/notes/obsidian-syncthing',
        destination: '/blog/most-powerful-free-notes-obsidian-syncthing',
        permanent: true,
      },
      {
        source: '/notes/tailscale',
        destination: '/blog/tailscale-access-any-device-anywhere',
        permanent: true,
      },
      {
        source: '/notes/vps-monitoring',
        destination: '/blog/vps-monitoring-grafana-prometheus-blackbox',
        permanent: true,
      },
      {
        source: '/notes/thirty-dead-components',
        destination: '/blog/why-i-rebuilt-my-portfolio',
        permanent: true,
      },
      { source: '/notes', destination: '/blog', permanent: true },
      { source: '/notes/', destination: '/blog', permanent: true },
      { source: '/notes/:slug*', destination: '/blog', permanent: true },

      // Common URL variants & feeds
      { source: '/resume', destination: '/resume.pdf', permanent: true },
      { source: '/cv', destination: '/resume.pdf', permanent: true },
      { source: '/feed', destination: '/rss.xml', permanent: true },
      { source: '/rss', destination: '/rss.xml', permanent: true },
      { source: '/sitemap', destination: '/sitemap.xml', permanent: true },
    ]
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            // The other three security headers were here; HSTS was not, so a
            // first visit negotiated plain HTTP before being redirected.
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        // Exactly one document opts out of DENY: the Huginn specimen, which
        // /design-system/huginn embeds from this same origin. The blanket DENY
        // blocked that iframe outright, and relaxing the whole site to
        // SAMEORIGIN would hand every page here the ability to frame every other
        // page here -- one page's need is not a reason to weaken the rest.
        //
        // Next applies matching header rules in array order with setHeader
        // semantics, so this later, narrower rule replaces the DENY above rather
        // than joining it. SAMEORIGIN still blocks every third-party frame; only
        // this origin may frame this one file. The framing page itself stays
        // DENY, so the embed cannot be nested inside another copy of itself.
        //
        // The file is `specimen.html` and must never be renamed back to
        // `index.html`. Cloudflare serves static assets before the worker, and
        // `auto-trailing-slash` maps `/design-system/huginn` to
        // `huginn/index.html` -- so an index.html there silently replaced the
        // route and the case page became unreachable in production while still
        // working in `next dev`. Any name other than index.html keeps the route.
        source: '/design-system/huginn/specimen.html',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ]
  },
}

// Only apply bundle analyzer when ANALYZE=true. This keeps it out of the
// normal build path rather than measuring a plugin that is not measuring.
export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzerInit({ enabled: true })(nextConfig)
  : nextConfig
