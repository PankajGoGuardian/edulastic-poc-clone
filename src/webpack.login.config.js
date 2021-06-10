require('dotenv').config()
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, 'login.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', 'public', 'login', 'index.html'),
    }),
    new BundleAnalyzerPlugin(),
  ],
}
