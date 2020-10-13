module.exports = {
  presets: [['@babel/preset-react']],
  plugins: [
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
  ],
}
