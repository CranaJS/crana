const path = require('path');
const { appRootPath } = require('../paths');

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

const extensions = [];

function setupExtension(extension) {
  const {
    name,
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
    client: {
      webpack: {
        common: path.resolve(appRootPath, common),
        dev: path.resolve(appRootPath, dev),
        prod: path.resolve(appRootPath, prod)
      },
      babel: path.resolve(appRootPath, babel)
    }
  });
}

setupExtension({
  name: 'test-plugin',
  client: {
    webpack: {
      dev: 'config/webpack.dev.js',
      common: 'config/webpack.common.js',
      prod: 'config/webpack.prod.js'
    },
    babel: 'config/babel.config.json'
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
