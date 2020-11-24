process.env.NODE_ENV = process.env.NODE_ENV || 'development'

let babelPreset = require('babel-preset-react-app')()
// (() => {}, {
// runtime: 'automatic',})

babelPreset = { ...babelPreset }

babelPreset.sourceType = 'unambiguous'

babelPreset.plugins.push.apply(babelPreset.plugins, [
  [
    'import',
    {
      libraryName: 'antd',
    },
    'antd',
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

babelPreset.env = {
  "test": {
    "plugins": [ "istanbul" ]
  }
}

module.exports = babelPreset
