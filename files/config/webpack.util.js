const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const path = require('path');

const PATHS = {
    client: {
      app: path.resolve(__dirname, `../src/client`),
      build: path.resolve(__dirname, '../build/client')
    },
    shared: path.resolve(__dirname, `../src/shared`),
    assets: path.resolve(__dirname, `../assets`)
};

function loadCSS({ use = [] }) {
    return {
        test: /\.css$/,
        use: [
          ...use,
          `css-loader`,
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [require("postcss-cssnext")()],
            },
          }
        ]
    };
}

function createAnalyzer(dev = true) {
  return new BundleAnalyzerPlugin({
    analyzerMode: dev ? `server` : `static`,
    openAnalyzer: !dev,
    reportFilename: path.join(__dirname, `../build/reports/bundle-analysis.html`)
  });
}

function createLinter(dev = true) {
  return {
    test: [/\.js$/,  /\.jsx$/],
    enforce: `pre`,
    loader: "eslint-loader",
    options: {
      fix: !dev
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
