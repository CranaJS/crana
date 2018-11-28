/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const fs = require('fs');

const { packageRootPath } = require('../paths');

function listExtensions() {
  const officialExtDir = path.join(packageRootPath, 'official-extensions');
  const officialExtensions = fs
    .readdirSync(officialExtDir)
    .map(extPath => ({
      extension: require(path.join(officialExtDir, extPath, 'crana.config.js')),
      path: path.join(officialExtDir, extPath),
      type: 'official'
    }));
  return officialExtensions;
}

module.exports = listExtensions;

module.exports.findExtension = function findExtension(extName) {
  let foundExtension = null;
  // First search in local official-extensions
  const officialExtensions = listExtensions();
  const {
    extension: foundExtObj, path: extPath
  } = officialExtensions.find(ext => ext.extension.name === extName);
  foundExtension = foundExtObj;
  // TODO:
  // If not present, have look at NPM registry

  if (!foundExtension)
    throw new Error(`Crana-extension ${extName} does not exist. Make sure it has no typo.`);

  return {
    ...foundExtension,
    path: extPath
  };
};
