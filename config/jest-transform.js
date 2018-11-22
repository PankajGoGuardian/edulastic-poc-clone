const config = {
  babelrc: false,
  presets: [
    [
      'env',
      {
        modules: false
      },
    ],
    'es2015',
    'react',
    'stage-2',
  ],
  plugins: [
    'transform-es2015-modules-commonjs'
  ]
};
module.exports = require('babel-jest').createTransformer(config);
