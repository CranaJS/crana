/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const fs = require('fs');
const del = require('del');
const deepmerge = require('deepmerge');

const {
  appRootPath,
  packageRootPath,
  appServer,
  appShared
} = require('../paths');

const { findExtension } = require('./ls');

const {
  installIfNotExists,
  fileExists,
  getProperty,
  copyDir,
  execCmd
} = require('../util');
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
    return val ? path.resolve(extension.path ? extension.path : appRootPath, val) : null;
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
      .map(ext => ext.eslint ? require(getPath(ext.eslint)) : null)
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
    startDev: allCommands.startDev.map(cmd => cmd({ appServer, appShared, appRootPath })),
    startProd: allCommands.startProd.map(cmd => cmd({ appServer, appShared, appRootPath })),
    build: allCommands.build.map(cmd => cmd({ appServer, appShared, appRootPath }))
  };
}

async function setupTemplate(extensionObjs) {
  // This function only has an effect once
  // As long as the '.defaulttemplate' file exists in the root of the project
  // It will delete this file if present and setup template according to extensions

  // Attention: If multiple extensions expose a template for the same folder
  //        the last one will "win"

  const defaultTemplateCheckFilePath = path.join(appRootPath, '.defaulttemplate');
  if (!await fileExists(defaultTemplateCheckFilePath))
    return;

  // Copy all template files for server, client and shared where present in extensions
  const {
    client,
    server,
    shared
  } = extensionObjs.reduce((acc, extension) => {
    if (!extension.template)
      return acc;

    let templateFolderPath;
    if (Array.isArray(extension.template))
      [templateFolderPath] = extension.template;
    else
      templateFolderPath = extension.template;

    const possibleClientFolderPath = path.join(extension.path, templateFolderPath, 'client');
    const possibleSharedFolderPath = path.join(extension.path, templateFolderPath, 'shared');
    const possibleServerFolderPath = path.join(extension.path, templateFolderPath, 'server');

    return {
      client: fs.existsSync(possibleClientFolderPath) ? possibleClientFolderPath : acc.client,
      server: fs.existsSync(possibleServerFolderPath) ? possibleServerFolderPath : acc.server,
      shared: fs.existsSync(possibleSharedFolderPath) ? possibleSharedFolderPath : acc.shared
    };
  }, {
    client: null, server: null, shared: null
  });

  const copyPromises = [client, server, shared]
    .map((folderPath) => {
      if (folderPath) {
        const destination = path.join(appRootPath, 'src', path.basename(folderPath));
        // First delete existing folder's content
        del.sync([destination]);
        return copyDir({ source: folderPath, destination });
      }
      return null;
    });

  await Promise.all(copyPromises);

  // Delete check file
  fs.unlinkSync(defaultTemplateCheckFilePath);
}

function installTemplateDependencies(extensionObjs) {
  const dependenciesToInstall = extensionObjs.reduce((acc, extension) => {
    let dependencies = {};
    if (Array.isArray(extension.template))
      [, { dependencies }] = extension.template;
    if (!extension.template)
      return acc;
    return { ...acc.dependencies, ...dependencies };
  });

  // For each applied template, install dependencies locally in project
  // if not listed in package.json yet
  const { dependencies: installedDeps } = require(path.join(appRootPath, 'package.json'));
  const dependenciesNotInstalledYet = Object.keys(dependenciesToInstall)
    .filter(dep => !Object.keys(installedDeps).includes(dep));
  const dependenciesInCorrectFormat = dependenciesNotInstalledYet
    .map((dependency) => {
      const version = dependenciesToInstall[dependency];
      return `${dependency}@${version}`;
    })
    .join(' ');

  if (dependenciesInCorrectFormat.length > 0)
    execCmd(`npm i -S ${dependenciesInCorrectFormat}`, { cwd: appRootPath, async: false });
}

async function setupExtensions() {
  // Read config from project's crana.config.js
  const filePath = path.resolve(appRootPath, 'crana.config.js');
  const exists = await fileExists(filePath);
  if (!exists)
    return;

  const { extensions: extensionsInConfig, extend } = require(filePath);

  const extensionObjs = extensionsInConfig
    .map(extName => findExtension(extName))
    .concat(extend);

  // Setup template
  await setupTemplate(extensionObjs);
  await installTemplateDependencies(extensionObjs);

  // Setup all extensions now
  extensionObjs.forEach(extObj => setupExtension(extObj));
}

module.exports = {
  setupExtensions,
  extensions,
  getConfigurationsToAdd,
  getAllServerCommands
};
