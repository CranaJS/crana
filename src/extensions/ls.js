/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const fs = require('fs');

const { packageRootPath } = require('../paths');

module.exports = function listExtensions() {
  const officialExtDir = path.join(packageRootPath, 'official-extensions');
  const officialExtensions = fs
    .readdirSync(officialExtDir)
    .map(extPath => ({
      extension: require(path.join(officialExtDir, extPath, 'crana.config.js')),
      type: 'official'
    }));
  return officialExtensions;
};
