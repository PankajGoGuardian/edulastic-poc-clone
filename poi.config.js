require("dotenv").config();
const BundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MomentLocalesPlugin = require("moment-locales-webpack-plugin");
const ReactRefreshPlugin = require("react-refresh-webpack-plugin");
const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const webpack = require("webpack");
const path = require("path");
const CircularDependencyPlugin = require("circular-dependency-plugin");

console.log("port", port);
let config = {
  entry: "./src/client/index.js",
  devServer: {
    port
  },
  output: {
    dir: process.env.DESTINATION || "./dist",
    sourceMap: true,
    ...(process.env.QUICK_BUILD ? { sourceMap: false, minimize: false } : {})
  },
  configureWebpack: {
    resolve: {
      alias: {
        appDetails: path.resolve(__dirname, "package.json")
      }
    }
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
