/* config-overrides.js */
require('dotenv').config()
const {
  override,
  disableEsLint,
  addBundleVisualizer,
  adjustWorkbox,
} = require('customize-cra')
const webpack = require('webpack')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const { setIn, getIn } = require('timm')
const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('simple-progress-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const packageJson = require('./package.json')

/** Uncomment to have a copy of files written on disk */
// const util = require('util')
// const fs = require('fs')
/** Uncomment to have a copy of files written on disk */

// const rootNodeModDir = path.resolve(__dirname, 'node_modules')

module.exports = override(
  disableEsLint(),
  // add webpack bundle visualizer if BUNDLE_VISUALIZE flag is enabled
  process.env.BUNDLE_VISUALIZE && addBundleVisualizer(),
  adjustWorkbox((wb) =>
    Object.assign(wb, {
      skipWaiting: true,
      exclude: (wb.exclude || []).concat('index.html'),
    })
  ),
  (config) => {
    const isProduction = process.env.NODE_ENV === 'production'
    /* eslint-disable no-param-reassign */

    config.module.rules[0].parser.requireEnsure = true

    // config.module.noParse = /pdfjs-dist/

    // add our global node modules if in workspace
    // config.resolve.modules.push(rootNodeModDir)

    let rules = getIn(config.module.rules, [1, 'oneOf'])

    rules = rules.map((rule) => {
      // remove the presets already in babel and rely on our preset
      if (
        rule.test &&
        rule.test.toString() === /\.(js|mjs|jsx|ts|tsx)$/.toString()
      ) {
        const overrideRule = { ...rule }

        delete overrideRule.options.presets
        delete overrideRule.options.plugins
        // rely on our babelrc for transforms
        overrideRule.options.extends = path.resolve(
          __dirname,
          './babel.config.js'
        )

        return overrideRule
      }

      if (rule.test && rule.test.toString() === /\.(js|mjs)$/.toString()) {
        const overrideRule = { ...rule }

        delete overrideRule.options.presets

        // rely on our babelrc for transforms
        overrideRule.options.extends = path.resolve(
          __dirname,
          './babel.config.js'
        )

        return overrideRule
      }

      if (isProduction) {
        /** These are dev deps and only used in development.
         * Exclude from prod vendors */
        config.externals = {
          'redux-freeze': 'redux-freeze',
          '@welldone-software/why-did-you-render':
            '@welldone-software/why-did-you-render',
        }
      }

      // add strict context on this imports - ideally for isomorphic-unfetch
      // config.module.strictThisContextOnImports = true

      return rule
    })

    // override with our config
    config.module.rules = setIn(config.module.rules, [1, 'oneOf'], rules)

    if (isProduction) {
      config.plugins.unshift(
        new webpack.HashedModuleIdsPlugin() // so that file hashes don't change unexpectedly
      )
    }

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
          __CLIENT_VERSION__: JSON.stringify(packageJson.version),
        },
        __SERVER__: false,
        __PROD__: isProduction,
        __DEV__: !isProduction,
        __CLIENT__: true,
        __TEST__: false,
      })
    )

    config.plugins.push(new MomentLocalesPlugin())

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
            to: 'pdf.worker.js',
          },
        ],
      })
    )

    config.plugins.push(
      new webpack.BannerPlugin({ banner: `${Date()} Copyright Snapwiz` })
    )

    if (!isProduction) {
      config.plugins.push(new ProgressBarPlugin())
    } else {
      config.plugins.push(
        new ScriptExtHtmlWebpackPlugin({
          sync: /main|app/,
          defaultAttribute: 'defer',
          async: /react-pdf|froala-editor|pdfjs-dist|jsx-graph/,
          // preload: {
          //   test: /\.js$/,
          //   chunks: 'async',
          // },
        })
      )
    }

    /* eslint-enable no-param-reassign */

    if (process.env.QUICK_BUILD) {
      config.devtool = false
      config.output.sourceMap = false
      config.output.minimize = false
    }

    // config.output.path = path.resolve(__dirname, 'dist')

    // chunking optimization
    if (!isProduction) {
      config.output.filename = 'app.js'
      config.output.chunkFilename = '[name].chunk.js'
    } else {
      // config.devtool = false // disable sourcemaps on production
      config.output.filename = 'app.[chunkhash:8].js'
      config.output.chunkFilename = '[name].[chunkhash:8].chunk.js'

      // config.optimization = {
      //   splitChunks: {
      //     chunks(chunk) {
      //       // exclude `my-excluded-chunk`
      //       return !chunk.name.match(/auth/)
      //     },
      //   },
      //   runtimeChunk: true,
      //   // splitChunks: {
      //   //   cacheGroups: {
      //   //     vendor: {
      //   //       chunks: 'initial',
      //   //       test: /[\\/]node_modules[\\/]/,
      //   //       name: 'vendor',
      //   //       enforce: true,
      //   //     },
      //   //   },
      //   // },
      // }

      // config.optimization = {
      //   ...(config.optimization || {}),
      //   splitChunks: {
      //     chunks: 'all',
      //   },
      //   // Keep the runtime chunk seperated to enable long term caching
      //   // https://twitter.com/wSokra/status/969679223278505985
      //   runtimeChunk: true,
      // }

      // add chunk split optimizations
      config.optimization = {
        ...(config.optimization || {}),
        runtimeChunk: true,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 0,
          cacheGroups: {
            author: {
              test: /[\\/]author[\\/]/,
              name: 'author',
              enforce: true,
            },
            assessment: {
              test: /[\\/]assessment[\\/]/,
              name: 'assessment',
              enforce: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // get the name. E.g. node_modules/packageName/not/this/part.js
                // or node_modules/packageName
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1]

                // npm package names are URL-safe, but some servers don't like @ symbols
                return `vendor.lib.${packageName.replace('@', '')}`
              },
            },
            default: {
              minChunks: 2,
              priority: -20,
            },
          },
        },
      }
    }

    /** Uncomment to have a copy of files written on disk */
    // fs.writeFileSync(
    // 	path.resolve(__dirname, `./cra_wp_compiled.js`),
    // 	util.inspect(config, {
    // 		showHidden: false,
    // 		depth: null,
    // 	}),
    // 	'utf-8',
    // 	err => {
    // 		if (err) throw err
    // 	}
    // )
    /** Uncomment to have a copy of files written on disk */

    return config
  }
)
