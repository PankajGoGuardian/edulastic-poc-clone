require('dotenv').config();
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // change to production while building for extension
  mode: 'production',
  entry: path.resolve(__dirname, 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"]
        }
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            options: {
              name: "[name].[ext]",
              outputPath: "img/"
            },
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'index.html') }),
      new CopyPlugin([
        { from: "src/chrome-extension/manifest.json", to: "." },
        { from: "src/chrome-extension/content.js", to: "." },
        { from: "src/chrome-extension/background.js", to: "." },
        { from: "src/chrome-extension/static/128x128.png", to: "img" }
      ])
    ]
};