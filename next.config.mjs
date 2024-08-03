// @ts-nocheck
import withSerwistInit from '@serwist/next';

// You may want to use a more robust revision to cache
// files more efficiently.
// A viable option is `git rev-parse HEAD`.
const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
  cacheOnNavigation: true,
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // additionalPrecacheEntries: [{ url: "/~offline", revision }],
  register: true,
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
};

export default withSerwist(nextConfig);
