const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.js');
const path = require('path');

console.log('starting wepback !');

const port = process.env.WEBPACK_PORT || 9090;

const options = {
  publicPath: config.output.publicPath,
  hot: true,
  inline: true,
  stats: { colors: true }
};

const server = new WebpackDevServer(webpack(config), options);

server.listen(port, 'localhost', err => {
  if (err) {
    console.log(err);
  }

  console.log(`WebpackDevServer listening at localhost: ${port}`);
});
