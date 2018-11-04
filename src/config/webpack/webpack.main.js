/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const merge = require('webpack-merge');

const createCommonBrowserConfig = require('./browser/webpack.common.js');
const createDevBrowserConfig = require('./browser/webpack.dev.js');
const createProdBrowserConfig = require('./browser/webpack.prod.js');

const configsToAdd = JSON.parse(process.env.ADD_CONFIGS);

function mergeConfigs(configs) {
  return configs
    .map(configPath => require(configPath))
    .reduce((acc, config) => merge(acc, config), {});
}

const commonBrowserConfig = createCommonBrowserConfig({
  additionalBabelConfigs: configsToAdd.babel
});

// Require all configs to add and merge them (those are the configs which come from the extensions)
const configsToMerge = {
  common: mergeConfigs(configsToAdd.common),
  dev: mergeConfigs(configsToAdd.dev),
  prod: mergeConfigs(configsToAdd.prod)
};

module.exports = function createConfig({ target, mode }) {
  const configurations = {
    browser: {
      development: merge(
        configsToMerge.common,
        configsToMerge.dev,
        commonBrowserConfig,
        createDevBrowserConfig()
      ),
      production: merge(
        configsToMerge.common,
        configsToMerge.prod,
        commonBrowserConfig,
        createProdBrowserConfig()
      )
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
