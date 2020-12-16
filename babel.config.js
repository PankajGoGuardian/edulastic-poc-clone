process.env.NODE_ENV = process.env.NODE_ENV || 'development'

let babelPreset = require('babel-preset-react-app')()
// (() => {}, {
// runtime: 'automatic',})

babelPreset = { ...babelPreset }

babelPreset.sourceType = 'unambiguous'

babelPreset.plugins.push.apply(babelPreset.plugins, [
  [
    'transform-imports',
    {
      '@edulastic/icons': {
        transform: '@edulastic/icons/src/${member}',
        preventFullImport: true,
      },
      antd: {
        transform: (importName) => {
          return `antd/es/${importName
            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
            .replace(/^-/, '')
            .toLowerCase()}`
        },
        preventFullImport: true,
      },
    },
  ],
  [
    'styled-components',
    {
      useDisplayName: false,
    },
  ],
  'lodash',
  'react-require',
  '@loadable/babel-plugin',
  [
    require.resolve('babel-plugin-named-asset-import'),
    {
      loaderMap: {
        svg: {
          ReactComponent: '@svgr/webpack?-svgo,+titleProp,+ref![path]',
        },
      },
    },
  ],
])

module.exports = babelPreset
