const nanoid = require('next/dist/compiled/nanoid/index.js')
const webpack = require('webpack') // eslint-disable-line import/no-extraneous-dependencies
const path = require('path')

module.exports = {
  generateBuildId: async () => {
    let buildId = null
    // don't let it contain ad (so adblockers don't false positive)
    // don't let it start with a hyphen that confuses cli tools
    // from https://github.com/zeit/next.js/blob/3e51ddb8af55b6438aa3aeb382081b9a1c86f325/packages/next/build/generate-build-id.ts#L10-L12
    while (!buildId || /ad/i.test(buildId) || /^-/i.test(buildId)) {
      buildId = nanoid()
    }

    return buildId
  },
  webpack(config, options) {
    config.plugins = config.plugins || []

    // Enable compile time replacement of sentry variables
    // A release is coupled to the source maps that are uploaded
    // so shouldn't change at runtime
    // A release is tied to a sentry account, so dsn shouldn't change at runtime
    config.plugins.push(
      new webpack.DefinePlugin({
        // Sentry key is public anyways
        'process.env.SENTRY_DSN': JSON.stringify('https://49bc0e7756294a83b8d23ab5c90a2e7d@sentry.io/1513999'),
        'process.env.SENTRY_RELEASE': JSON.stringify(options.buildId)
      })
    )


    if (!options.isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }


    if (!options.dev) {
      // hidden source maps so we don't expose them to clients but are generated to upload to sentry
      config.devtool = 'hidden-source-map'

      // eslint-disable-next-line no-restricted-syntax
      for (const plugin of config.plugins) {
        if (plugin.constructor.name === 'UglifyJsPlugin') {
          plugin.options.sourceMap = true
          break
        }
      }

      if (config.optimization && config.optimization.minimizer) {
        // eslint-disable-next-line no-restricted-syntax
        for (const plugin of config.optimization.minimizer) {
          if (plugin.constructor.name === 'TerserPlugin') {
            plugin.options.sourceMap = true
            break
          }
        }
      }
    }

    return config
  }
}
