const path = require('path');

const appRootPath = process.env.APP_ROOT || process.cwd();
const appItRoot = process.env.APP_IT_ROOT || path.dirname(require.main.filename);

module.exports = {
  packageRootPath: appItRoot,
  appRootPath,
  appShared: path.join(appRootPath, 'src/shared'),
  appClient: path.join(appRootPath, 'src/client'),
  appServer: path.join(appRootPath, 'src/server')
};
