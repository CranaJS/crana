const path = require('path');
const webpack = require('webpack');
const WebpackNotifierPlugin = require('webpack-notifier');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const {
  PATHS, loadCSS, createAnalyzer, createLinter
} = require('../webpack.util.js');

/* eslint-disable-next-line import/no-dynamic-require */
const packageJSON = require(path.join(PATHS.root, 'package.json'));

const {
  proxy,
  displayName,
  openBrowser,
  webpackDevServer
} = packageJSON.crana;

const { host, https } = webpackDevServer || {};

module.exports = function create() {
  const DEV_CONFIG = {
    mode: 'development',
    devtool: 'cheap-eval-source-map',
    devServer: {
      contentBase: PATHS.client.build,
      historyApiFallback: true,
      quiet: true,
      hot: true,
      host,
      https,
      open: (openBrowser === false) ? false : (openBrowser || 'chrome'),
      proxy
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new WebpackNotifierPlugin({
        excludeWarnings: true,
        title: displayName
      }),
      new FriendlyErrorsWebpackPlugin(),
      createAnalyzer(true)
    ],
    module: {
      rules: [
        createLinter(true),
        loadCSS({ use: ['style-loader'] })
      ]
    }
  };

  return DEV_CONFIG;
};
