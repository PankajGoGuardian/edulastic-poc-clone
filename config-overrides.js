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
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin')
const path = require('path')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const packageJson = require('./package.json')
const ProgressBarPlugin = require('simple-progress-webpack-plugin')

/** Uncomment to have a copy of files written on disk */
// const util = require('util')
// const fs = require('fs')
/** Uncomment to have a copy of files written on disk */

const rootNodeModDir = path.resolve(__dirname, 'node_modules')

module.exports = override(
  disableEsLint(),
  // add webpack bundle visualizer if BUNDLE_VISUALIZE flag is enabled
  process.env.BUNDLE_VISUALIZE === 1 && addBundleVisualizer(),
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

    config.resolve.plugins = config.resolve.plugins.filter(
      (plugin) => !(plugin instanceof ModuleScopePlugin)
    )

    // add our global node modules if in workspace
    config.resolve.modules.push(rootNodeModDir)

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
      config.module.strictThisContextOnImports = true

      return rule
    })

    // override with our config
    config.module.rules = setIn(config.module.rules, [1, 'oneOf'], rules)

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
    config.plugins.push(
      new LodashModuleReplacementPlugin({
        caching: true,
        collections: true,
        shorthands: true,
      })
    )
    config.plugins.push(new MomentLocalesPlugin())

    // config.plugins.push(
    //   new CopyPlugin({
    //     patterns: [
    //       {
    //         from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
    //         to: 'pdf.worker.js',
    //       },
    //     ],
    //   })
    // )

    config.plugins.push(
      new webpack.BannerPlugin({ banner: `${Date()} Copyright Snapwiz` })
    )

    config.plugins.push(new ProgressBarPlugin())

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

    /* eslint-enable no-param-reassign */

    if (process.env.PUBLIC_URL) {
      config.output.publicUrl = process.env.PUBLIC_URL
    }

    if (process.env.QUICK_BUILD) {
      config.output.sourceMap = false
      config.output.minimize = false
    }

    return config
  }
)
