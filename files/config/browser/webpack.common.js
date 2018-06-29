const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const path = require(`path`);
const { PATHS } = require(`../webpack.util.js`);

const package = require('../../package.json');

const { aliases, displayName } = package['app-it'];

const aliasObj = {};
Object.keys(aliases).forEach((alias) => {
  aliasObj[alias] = path.resolve(__dirname, '../..', aliases[alias]);
});

module.exports = function create() {

  return {
    entry: ["babel-polyfill", path.join(PATHS.client.app, `index.jsx`)],
    resolve: {
      extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
      alias: aliasObj
    },
    output: {
      publicPath: '/',
      filename: '[name].[hash:4].js',
      path: PATHS.client.build,
      chunkFilename: `[name].[chunkhash:4].js`
    },
    plugins: [
      new HtmlWebpackPlugin({
          title: displayName,
          template: path.join(PATHS.assets, `index.html`)
      }),
      new StyleLintPlugin({
        configFile: path.resolve(__dirname, `../../.stylelintrc`),
        context: PATHS.client.app,
        files: '**/*.css',
        fix: true
      })
    ],
    module: {
        rules: [
          {
            test: [/\.js$/,  /\.jsx$/],
            use: `babel-loader`,
            include: [PATHS.client.app, PATHS.shared]
          },
          {
            test: /\.(jpg|png|svg|gif)$/,
            use: {
              loader: "url-loader",
              options: {
                limit: 15000,
              }
            }
          },
          {
            test: /\.(ttf|eot|woff|woff2)$/,
            use: {
              loader: "file-loader",
              options: {
                name: "fonts/[name].[hash:4].[ext]",
              },
            }
          }
        ]
    },
    performance: {
      hints: process.env.NODE_ENV === 'production' ? "warning" : false
    },
    node: {
      fs: 'empty',
      dns: 'empty',
      net: 'empty',
      tls: 'empty',
      module: 'empty'
    }
  };
}
