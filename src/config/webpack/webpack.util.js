const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const nextCSS = require('postcss-cssnext');

const { appRootPath, packageRootPath } = require('../../paths');

const PATHS = {
  client: {
    app: path.resolve(appRootPath, 'src/client'),
    build: path.resolve(appRootPath, 'build/client')
  },
  shared: path.resolve(appRootPath, 'src/shared'),
  assets: path.resolve(appRootPath, 'assets'),
  root: appRootPath,
  cranaRoot: path.join(__dirname, '../../../')
};

function loadCSS({ use = [] }) {
  return {
    test: /\.css$/,
    include: [PATHS.client.app, PATHS.shared],
    use: [
      ...use,
      {
        loader: 'css-loader',
        options: {
          modules: true
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: () => [nextCSS()],
        },
      }
    ]
  };
}

function createAnalyzer(dev = true) {
  return new BundleAnalyzerPlugin({
    analyzerMode: dev ? 'server' : 'static',
    openAnalyzer: !dev,
    reportFilename: path.join(appRootPath, 'build/reports/bundle-analysis.html')
  });
}

function createLinter() {
  return {
    test: [/\.js$/, /\.jsx$/],
    enforce: 'pre',
    loader: 'eslint-loader',
    options: {
      fix: true,
      configFile: path.join(packageRootPath, '.eslintrctemp')
    },
    include: [PATHS.client.app, PATHS.shared]
  };
}

module.exports = {
  PATHS,
  loadCSS,
  createAnalyzer,
  createLinter
};
