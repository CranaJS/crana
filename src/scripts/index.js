const path = require('path');
const { promisify } = require('util');
const chokidar = require('chokidar');
const { subdirs: subdirsCb } = require('node-dir');

const { execCmd, fileExists, createEnvCmd } = require('../util');

const {
  appRootPath, appShared, appClient, packageRootPath, appServer
} = require('../paths');

const { getConfigurationsToAdd, getAllServerCommands, setupExtensions } = require('../extensions');

const readSubdirs = promisify(subdirsCb);

const eslintConfigPath = `${packageRootPath}/.eslintrctemp`;

function countLines() {
  return execCmd(`npx cloc ${appRootPath} --exclude-dir=node_modules,.git,build --exclude-ext=json`);
}

async function lintClient() {
  // Execute linting in parallel
  // Recursively go through all client dirs and lint them
  // Globbing doesn't seem to work with eslint
  const dirs = [
    ...await readSubdirs(appClient),
    ...await readSubdirs(appShared),
    appClient,
    appShared
  ];

  dirs.forEach((dir) => {
    execCmd(`npx eslint ${dir}/*.js --fix --config ${eslintConfigPath}`, { async: true });
    execCmd(`npx stylelint ${dir}/*.css --fix --config ${packageRootPath}/.stylelintrc`, { async: true });
  });
}

function devClient() {
  // First autofix all via linting
  lintClient();
  const cmd = createEnvCmd(
    {
      BABEL_ENV: 'browser',
      APP_ROOT: appRootPath,
      APP_IT_ROOT: packageRootPath,
      ADD_CONFIGS: JSON.stringify(getConfigurationsToAdd()) // Extensions
    },
    `npx webpack-dev-server
      --config ${packageRootPath}/src/config/webpack/webpack.main.js
      --env.target browser
      --env.mode development`
  );
  execCmd(cmd, { async: true });
}

async function lintServer() {
  const dirs = [
    ...await readSubdirs(appServer),
    ...await readSubdirs(appShared),
    appServer,
    appShared
  ];
  dirs.forEach((dir) => {
    execCmd(`npx eslint ${dir}/*.js --fix --config ${eslintConfigPath}`, { async: true });
  });
}

function devServer() {
  const cmd = createEnvCmd(
    { CRANA_MODE: 'development', BABEL_ENV: 'node' },
    `
      node ${appServer}/start-server.js --inspect
    `
  );

  let subProcs = [];

  const { startDev } = getAllServerCommands();

  function onChange() {
    if (subProcs.length > 0) {
      subProcs.forEach(proc => proc.kill());
      subProcs = [];
    }
    lintServer();
    if (startDev.length === 0) // No extension registered a cusom startDev handler
      subProcs = [execCmd(cmd, { async: true, cwd: appRootPath })];
    else {
      startDev.forEach((startDevCmd) => {
        let cmdStr = startDevCmd;
        let cwd = null;
        if (startDevCmd.cmd) {
          cmdStr = startDevCmd.cmd;
          if (startDevCmd.cwd === 'app')
            cwd = appRootPath;
        }
        const cmdToExecute = createEnvCmd({ CRANA_MODE: 'development', BABEL_ENV: 'node' }, `npx ${cmdStr}`);
        const shouldExec = startDevCmd.liveReload !== undefined &&
          startDevCmd.liveReload !== null &&
          startDevCmd.liveReload === false &&
          !startDevCmd.wasExecuted;

        if (shouldExec) {
          /* eslint-disable-next-line no-param-reassign */
          startDevCmd.wasExecuted = true;
          subProcs.push(
            execCmd(cmdToExecute, { async: true, cwd })
          );
        }
      });
    }
  }

  chokidar.watch([appServer, appShared], { ignored: /(^|[/\\])\../ }).on('change', onChange);
  onChange();
}

function dev() {
  devServer();
  devClient();
}

function buildClient() {
  const cmd = createEnvCmd(
    {
      BABEL_ENV: 'browser',
      APP_ROOT: appRootPath,
      APP_IT_ROOT: packageRootPath,
      ADD_CONFIGS: JSON.stringify(getConfigurationsToAdd()) // Extensions
    },
    `npx webpack
      --config ${packageRootPath}/src/config/webpack/webpack.main.js
      --env.target browser
      --env.mode production`
  );
  execCmd(cmd, { async: true });
}

function buildServer() {
  const { build } = getAllServerCommands();
  if (build.length === 0)
    console.error('No extension specified a build command. Maybe you do not need to build/compile your server files.');
  else {
    build.forEach((buildCmd) => {
      execCmd(`npx ${buildCmd}`);
    });
  }
}

function start() {
  const { startProd } = getAllServerCommands();
  if (startProd.length === 0) {
    const cmd = `node ${appServer}/start-server.js`;
    execCmd(cmd, { async: true, cwd: appRootPath });
  } else {
    startProd.forEach((prodCmd) => {
      execCmd(`npx ${prodCmd}`, { async: true, cwd: appRootPath });
    });
  }
}

const commands = [
  {
    name: 'dev',
    fn: dev,
    description: 'Concurrently starts the frontend and the backend in development mode.'
  },
  {
    name: 'count-lines',
    fn: countLines,
    description: 'See how many LOC you\'ve already written.'
  },
  {
    name: 'lint:client',
    fn: lintClient,
    description: 'Executes eslint in autofix mode for your client files (src/client + src/shared).'
  },
  {
    name: 'lint:server',
    fn: lintServer,
    description: 'Executes eslint in autofix mode for your server files (src/server + src/shared).'
  },
  {
    name: 'dev:client',
    fn: devClient,
    description: 'Starts the webpack development server for the frontend.'
  },
  {
    name: 'dev:server',
    fn: devServer,
    description: 'Starts the node.js backend in development mode with live-reload.'
  },
  {
    name: 'start',
    fn: start,
    description: 'Starts the node.js server for production.'
  },
  {
    name: 'build:client',
    fn: buildClient,
    description: 'Creates a production build for the frontend application.'
  },
  {
    name: 'build:server',
    fn: buildServer,
    description: 'If you are using any extensions which uses a compiler or similar tools, files can be compiled/built with this command.'
  }
];

async function preHook() {
  // Executed before each of the above cmds is executed (for validation purpose)
  // Returns true if validation was successful, false otherwise

  // All of the above commands require the project to be a crana project

  // See if the current package.json has a crana field
  const error = 'The current directory is not a crana project!';

  const packageJSONpath = path.join(appRootPath, 'package.json');
  if (!await fileExists(packageJSONpath))
    return { error };
  /* eslint-disable-next-line */
  const packageJSON = require(packageJSONpath);
  if (!packageJSON.crana)
    return { error };

  // Explicitly setup extensions
  await setupExtensions();
  return { success: true };
}

module.exports = {
  commands,
  preHook
};
