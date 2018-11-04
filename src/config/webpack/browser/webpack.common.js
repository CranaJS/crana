/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require('path');
const mergeBabelConfigs = require('babel-merge');
const { PATHS } = require('../webpack.util.js');

/* eslint-disable-next-line import/no-dynamic-require */
const packageJSON = require(path.join(PATHS.root, 'package.json'));
/* eslint-disable-next-line import/no-dynamic-require */
const babelrc = require(path.join(PATHS.cranaRoot, 'babel.config.json'));

const { aliases, displayName } = packageJSON.crana;

const aliasObj = {};
Object.keys(aliases).forEach((alias) => {
  aliasObj[alias] = path.join(PATHS.root, aliases[alias]);
});

module.exports = function create({ additionalBabelConfigs }) {
  const babelConfigs = additionalBabelConfigs.map(configPath => require(configPath));
  const babelConfig = mergeBabelConfigs.all([babelrc, ...babelConfigs]);
  return {
    entry: ['babel-polyfill', path.join(PATHS.client.app, 'index.js')],
    resolve: {
      extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
      alias: aliasObj
    },
    output: {
      publicPath: '/',
      filename: '[name].[hash:4].js',
      path: PATHS.client.build,
      chunkFilename: '[name].[chunkhash:4].js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: displayName,
        template: path.join(PATHS.assets, 'index.html')
      }),
      new StyleLintPlugin({
        configFile: path.join(PATHS.cranaRoot, '.stylelintrc'),
        context: PATHS.client.app,
        files: '**/*.css',
        fix: true
      })
    ],
    module: {
      rules: [
        {
          test: [/\.js$/, /\.jsx$/],
          use: {
            loader: 'babel-loader',
            options: babelConfig
          },
          include: [PATHS.client.app, PATHS.shared]
        },
        {
          test: /\.(jpg|png|svg|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 15000,
            }
          }
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:4].[ext]',
            },
          }
        }
      ]
    },
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false
    },
    node: {
      fs: 'empty',
      dns: 'empty',
      net: 'empty',
      tls: 'empty',
      module: 'empty'
    }
  };
};
