/** @type {import('next').NextConfig} */

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
})
module.exports = withMDX({
  // Append the default value with md extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
})

module.exports = {
  reactStrictMode: true,
  webpack(config) {
    // eslint-disable-next-line no-param-reassign
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false, // https://stackoverflow.com/a/67478653/470749
    };

    return config;
  },
}
