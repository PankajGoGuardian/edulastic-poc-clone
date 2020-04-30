require("dotenv").config();
const BundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const webpack = require("webpack");
const path = require("path");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const packageJson = require("./package.json");

console.log("port", port);
let config = {
  entry: "./src/client/index.js",
  devServer: {
    port
  },
  envs: {
    // add the client package json env to be be consumed in the app
    // as process.env.__CLIENT_VERSION__
    __CLIENT_VERSION__: packageJson.version
  },
  output: {
    dir: process.env.DESTINATION || "./dist",
    sourceMap: true,
    ...(process.env.QUICK_BUILD ? { sourceMap: false, minimize: false } : {})
  },
  chainWebpack: (chain, opts) => {
    if (process.env.NODE_ENV === "production") {
      chain
        .plugin("Analyzer")
        .use(BundleAnalyzer, [{ analyzerMode: "static", defaultSizes: "gzip", openAnalyzer: false }]);
      chain.module
        .rule("js")
        .include.add(/node_modules\/\@edulastic/)
        .add(/node_modules\/query-string/)
        .add(/node_modules\/qs/)
        .add(/node_modules\/jsxgraph/)
        .add(/node_modules\/d3/)
        .add(/node_modules\/recharts/)
        .add(/node_modules\/recharts-scale/)
        .add(/node_modules\/canvas/)
        .add(/node_modules\/css-to-react-native/)
        .add(/node_modules\/striptags/)
        .add(/node_modules\/rc-util/)
        .add(/node_modules\/react-joyride/)
        .add(/node_modules\/react-modal/)
        .add(/node_modules\/dot-prop/)
        .add(/node_modules\/split-on-first/)
        .add(/node_modules\/acorn-jsx/)
        .add(/node_modules\/strict-uri-encode/)
        .add(/node_modules\/react-jsx-parser/)
        .add(/node_modules\/espree/);
      chain.module
        .rule("js")
        .use("babel-loader")
        .options({
          cacheDirectory: true,
          cacheCompression: true,
          cacheIdentifier: "jsx:react::namedImports:undefined",
          babelrc: false
        });
    }

    chain.plugin("MomentsLocale").use(MomentLocalesPlugin);

    chain.plugin("BannerPlugin").use(webpack.BannerPlugin, [{ banner: `${Date()} Copyright Snapwiz` }]);
    // chain.plugin("CircularDependencyPlugin").use(CircularDependencyPlugin);
    // not really required, since the plugin by itself is doing the same.
    if (process.env.NODE_ENV !== "production") chain.plugin("ReactRefreshPlugin").use(ReactRefreshPlugin);
  }
};
if (process.env.PUBLIC_URL) {
  config.output.publicUrl = process.env.PUBLIC_URL;
}
module.exports = config;
