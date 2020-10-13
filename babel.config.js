process.env.NODE_ENV = process.env.NODE_ENV || 'development'

let babelPreset = require('babel-preset-react-app')({
  flow: false,
  typescript: false,
})

babelPreset = { ...babelPreset }

babelPreset.plugins.push.apply(babelPreset.plugins, [
  [
    'import',
    {
      libraryName: 'antd',
    },
    'antd',
  ],
  'lodash',
  [
    'styled-components',
    {
      useDisplayName: false,
    },
  ],
])

module.exports = babelPreset
