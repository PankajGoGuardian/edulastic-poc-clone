const commonConfig = {
  presets: [
    [
      'poi/babel',
      {
        targets: { chrome: '39' },
      },
    ],
  ],
  plugins: [
    [
      'import',
      {
        libraryName: 'antd',
      },
      'antd',
    ],
    'lodash',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    'babel-plugin-styled-components',
  ],
}

module.exports = {
  env: {
    production: commonConfig,

    // development environment
    development: {
      ...commonConfig,
      plugins: [...commonConfig.plugins, 'react-refresh/babel'],
    },
  },
}
