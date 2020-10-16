process.env.NODE_ENV = process.env.NODE_ENV || 'development'

let babelPreset = require('babel-preset-react-app')()

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
])

module.exports = babelPreset
