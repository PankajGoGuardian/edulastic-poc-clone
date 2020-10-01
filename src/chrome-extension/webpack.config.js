const dotenv = require('dotenv')
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = () => {
  const env = dotenv.config({ path: 'src/chrome-extension/.env' }).parsed

  const envKeys = Object.keys(env).reduce((acc, curr) => {
    acc[`process.env.${curr}`] = JSON.stringify(env[curr])
    return acc
  }, {})

  return {
    // change to production while building for extension
    mode: 'production',
    entry: path.resolve(__dirname, 'index.js'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: 'chrome-extension://eadjoeopijphkogdmabgffpiiebjdgoo/',
    },
    module: {
      rules: [
        {
          test: /\.(css|scss)$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              options: {
                name: '[name].[ext]',
                outputPath: 'img/',
              },
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
      }),
      new CopyPlugin([
        { from: 'src/chrome-extension/manifest.json', to: '.' },
        { from: 'src/chrome-extension/content.js', to: '.' },
        { from: 'src/chrome-extension/muteInject.js', to: '.' },
        { from: 'src/chrome-extension/background.js', to: '.' },
        { from: 'src/chrome-extension/static/128x128.png', to: 'img' },
      ]),
    ],
    optimization: {
      usedExports: true,
    },
  }
}
