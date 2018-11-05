/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const deepmerge = require('deepmerge');
const {
  appRootPath,
  packageRootPath,
  appServer,
  appShared
} = require('../paths');
const fs = require('fs');

const { installIfNotExists, fileExists, getProperty } = require('../util');
/*
{
  name,
  eslint,
  template: { client, server, dependencies, devDependencies },
  server: { startDev, startProd, build },
  dependencies: cranaDependencies,
  client: {
    webpack: { common, dev, prod },
    stylelint,
    babel
  }
}
*/

const eslintStandardConfig = JSON.parse(fs.readFileSync(path.resolve(packageRootPath, '.eslintrc')));

const extensions = [];

function setupExtension(extension) {
  const {
    eslint,
    dependencies: cranaDependencies
  } = extension;
  // All parameters above are paths to '.js' files exporting
  //    the respective config files
  // Those files can either directly export a config object which will then be merged
  //    or a function which will be passed all important paths
  // First step needs to be: Install all dependencies in the scope of the local Crana package
  // Then, during the creation of all config files, the above specified files are required
  //    dynamically in the scope of Crana

  function getPath(val) {
    return val ? path.resolve(appRootPath, val) : null;
  }

  const babel = getProperty(extension, 'client.babel', null);
  const common = getProperty(extension, 'client.webpack.common');
  const dev = getProperty(extension, 'client.webpack.dev');
  const prod = getProperty(extension, 'client.webpack.prod');

  extensions.push({
    ...extension,
    eslint: getPath(eslint),
    client: {
      webpack: {
        common: getPath(common),
        dev: getPath(dev),
        prod: getPath(prod)
      },
      babel: getPath(babel)
    }
  });

  // Merge all eslint configs into a new (temp) file: '.eslintrctemp'
  const mergedEslintConfig = deepmerge.all([
    eslintStandardConfig,
    ...extensions
      .map(ext => ext.eslint ? require(ext.eslint) : null)
      .filter(config => config)
  ]);

  fs.writeFileSync(path.resolve(packageRootPath, '.eslintrctemp'), JSON.stringify(mergedEslintConfig));

  // Install dependencies
  if (cranaDependencies)
    Object.keys(cranaDependencies).forEach(key => installIfNotExists(key, cranaDependencies[key]));
}

function getConfigurationsToAdd() {
  // Concatenates all configuration files of the extensions
  // So you have one array of webpack configs to add, one array of babel configs etc...
  function concatIfExists(arr, val) {
    return val ? arr.concat(val) : arr;
  }
  return extensions.reduce((acc, ext) => {
    let retObj = acc;
    if (ext.client && ext.client.webpack) {
      retObj = {
        ...retObj,
        common: concatIfExists(acc.common, ext.client.webpack.common),
        dev: concatIfExists(acc.dev, ext.client.webpack.dev),
        prod: concatIfExists(acc.prod, ext.client.webpack.prod)
      };
    }
    if (ext.client && ext.client.babel) {
      return {
        ...retObj,
        babel: acc.babel.concat(ext.client.babel)
      };
    }
    return retObj;
  }, {
    common: [],
    dev: [],
    prod: [],
    babel: []
  });
}

function getAllServerCommands() {
  // Returns an array of all commands related to the server
  // They are then executed sequentially
  const allCommands = extensions.reduce((acc, ext) => {
    if (ext.server) {
      return {
        startDev: ext.server.startDev ?
          acc.startDev.concat(ext.server.startDev) : acc.startDev,
        startProd: ext.server.startProd ?
          acc.startProd.concat(ext.server.startProd) : acc.startProd,
        build: ext.server.build ?
          acc.build.concat(ext.server.build) : acc.build
      };
    }
    return acc;
  }, {
    startDev: [], // Executed in parallel
    startProd: [], // Executed in parallel
    build: [] // Executed sequentially
  });

  return {
    liveReload: !extensions.find(ext => ext.server && ext.server.liveReload === false),
    startDev: allCommands.startDev.map(cmd => cmd({ appServer, appShared, appRootPath })),
    startProd: allCommands.startProd.map(cmd => cmd({ appServer, appShared, appRootPath })),
    build: allCommands.build.map(cmd => cmd({ appServer, appShared, appRootPath }))
  };
}

async function initLocalExtension() {
  // If in the root of the project a 'crana.extend.js' file exists, install it as an extension
  const filePath = path.resolve(appRootPath, 'crana.extend.js');
  const exists = await fileExists(filePath);
  if (!exists)
    return;
  const localExtension = require(filePath);
  setupExtension(localExtension);
}

initLocalExtension();

module.exports = {
  setupExtension,
  extensions,
  getConfigurationsToAdd,
  getAllServerCommands
};
