/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const deepmerge = require('deepmerge');
const { appRootPath, packageRootPath } = require('../paths');
const fs = require('fs');

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
    name,
    eslint,
    client: {
      webpack: { common, dev, prod },
      babel
    },
    dependencies: cranaDependencies
  } = extension;
  // All parameters above are paths to '.js' files exporting
  //    the respective config files
  // Those files can either directly export a config object which will then be merged
  //    or a function which will be passed all important paths
  // First step needs to be: Install all dependencies in the scope of the local Crana package
  // Then, during the creation of all config files, the above specified files are required
  //    dynamically in the scope of Crana
  extensions.push({
    ...extension,
    eslint: eslint ? path.resolve(appRootPath, eslint) : null,
    client: {
      webpack: {
        common: path.resolve(appRootPath, common),
        dev: path.resolve(appRootPath, dev),
        prod: path.resolve(appRootPath, prod)
      },
      babel: path.resolve(appRootPath, babel)
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
}

setupExtension({
  name: 'test-plugin',
  eslint: 'config/eslint.config.json',
  client: {
    webpack: {
      dev: 'config/webpack.dev.js',
      common: 'config/webpack.common.js',
      prod: 'config/webpack.prod.js'
    },
    babel: 'config/babel.config.json',
  }
});

function getConfigurationsToAdd() {
  // Concatenates all configuration files of the extensions
  // So you have one array of webpack configs to add, one array of babel configs etc...
  return extensions.reduce((acc, ext) => {
    let retObj = acc;
    if (ext.client && ext.client.webpack) {
      retObj = {
        ...retObj,
        common: acc.common.concat(ext.client.webpack.common),
        dev: acc.common.concat(ext.client.webpack.dev),
        prod: acc.common.concat(ext.client.webpack.prod)
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

module.exports = {
  setupExtension,
  extensions,
  getConfigurationsToAdd
};
