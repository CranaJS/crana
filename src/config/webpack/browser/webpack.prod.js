const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const cssnano = require('cssnano');

const {
  PATHS, loadCSS, createAnalyzer, createLinter
} = require('../webpack.util.js');

const PROD_CONFIG = {
  mode: 'production',
  module: {
    rules: [
      createLinter(false),
      loadCSS({ use: [MiniCssExtractPlugin.loader] })
    ],
  },
  plugins: [
    new CleanWebpackPlugin([PATHS.client.build], { root: process.cwd() }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:4].css',
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        },
        // Run cssnano in safe mode to avoid
        // potentially unsafe transformations.
        safe: true
      },
      canPrint: false
    }),
    // PurifyCSS doesn't work with react-select for some reason :( fix that asap
    // new PurifyCSSPlugin({
    //  paths: glob.sync(`${PATHS.client.app}/**/*.js*`, { nodir: true}),
    //  purifyOptions: { whitelist: ['*leaflet*', '*Select*', '*react-select*'] }
    // }),
    new webpack.BannerPlugin({
      banner: 'filename:[name]'
    }),
    new DuplicatePackageCheckerPlugin(),
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    createAnalyzer(false)
  ],
  optimization: {
    splitChunks: {
      chunks: 'initial'
    },
    minimizer: [new UglifyWebpackPlugin({ uglifyOptions: { compress: { drop_console: true } } })],
    runtimeChunk: {
      name: 'manifest'
    }
  }
};

module.exports = function create() {
  return PROD_CONFIG;
};
