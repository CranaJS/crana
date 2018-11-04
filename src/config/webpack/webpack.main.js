/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const merge = require('webpack-merge');

const createCommonBrowserConfig = require('./browser/webpack.common.js');
const createDevBrowserConfig = require('./browser/webpack.dev.js');
const createProdBrowserConfig = require('./browser/webpack.prod.js');

const { PATHS } = require('./webpack.util.js');

const configsToAdd = JSON.parse(process.env.ADD_CONFIGS);

function createConfigs(configs) {
  if (!configs)
    return [];
  return configs.map((configPath) => {
    const config = require(configPath);
    if (typeof config === 'function')
      return config(PATHS);
    return config;
  });
}

const configs = {
  common: createConfigs(configsToAdd.common),
  dev: createConfigs(configsToAdd.dev),
  prod: createConfigs(configsToAdd.prod)
};

const commonBrowserConfig = createCommonBrowserConfig({
  additionalBabelConfigs: configsToAdd.babel
});

const finalDevConfig = merge([
  ...configs.common,
  ...configs.dev,
  commonBrowserConfig,
  createDevBrowserConfig()
]);

const finalProdConfig = merge([
  ...configs.common,
  ...configs.prod,
  commonBrowserConfig,
  createProdBrowserConfig()
]);

module.exports = function createConfig({ target, mode }) {
  const configurations = {
    browser: {
      development: finalDevConfig,
      production: finalProdConfig
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
