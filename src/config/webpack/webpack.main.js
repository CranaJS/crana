const merge = require('webpack-merge');

const createCommonBrowserConfig = require('./browser/webpack.common.js');
const createDevBrowserConfig = require('./browser/webpack.dev.js');
const createProdBrowserConfig = require('./browser/webpack.prod.js');

const commonBrowserConfig = createCommonBrowserConfig();

module.exports = function createConfig({ target, mode }) {
  const configurations = {
    browser: {
      development: merge(commonBrowserConfig, createDevBrowserConfig()),
      production: merge(commonBrowserConfig, createProdBrowserConfig())
    }
  };

  const targetObj = configurations[target];
  if (!targetObj)
    throw new Error(`Target "${target}" does not exist!`);
  const configuration = targetObj[mode];
  if (!configuration)
    throw new Error(`Mode "${mode}" for target "${target}" does not exist!`);

  return configuration;
};
