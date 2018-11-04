const path = require('path');
const chokidar = require('chokidar');

const { execCmd, fileExists, createEnvCmd } = require('../util');

const {
  appRootPath, appShared, appClient, packageRootPath, appServer
} = require('../paths');

const { getConfigurationsToAdd, getAllServerCommands } = require('../extensions');

const eslintConfigPath = `${packageRootPath}/.eslintrctemp`;

function countLines() {
  return execCmd(`npx cloc ${appRootPath} --exclude-dir=node_modules,.git,build --exclude-ext=json`);
}

function lintClient() {
  // Execute linting in parallel
  execCmd(`npx eslint ${appClient}/** --fix --config ${eslintConfigPath}`, { async: true });
  execCmd(`npx eslint ${appShared}/** --fix --config ${eslintConfigPath}`, { async: true });
  execCmd(`npx stylelint ${appClient}/**/*.css --fix --config ${packageRootPath}/.stylelintrc`, { async: true });
  execCmd(`npx stylelint ${appShared}/**/*.css --fix --config ${packageRootPath}/.stylelintrc`, { async: true });
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

function lintServer() {
  execCmd(`npx eslint ${appServer}/** --fix --config ${eslintConfigPath}`, { async: true });
  execCmd(`npx eslint ${appShared}/** --fix --config ${eslintConfigPath}`, { async: true });
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
        const cmdToExecute = createEnvCmd({ CRANA_MODE: 'development', BABEL_ENV: 'node' }, `npx ${startDevCmd}`);
        subProcs.push(
          execCmd(cmdToExecute, { async: true })
        );
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
  const cmd = `
        npx cross-env
            BABEL_ENV=browser
            npx cross-env
              APP_ROOT=${appRootPath}
                npx cross-env
                  APP_IT_ROOT=${packageRootPath}
                    npx webpack
                        --config ${packageRootPath}/src/config/webpack/webpack.main.js
                        --env.target browser
                        --env.mode production
    `;
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
    execCmd(cmd, { async: true });
  } else {
    startProd.forEach((prodCmd) => {
      execCmd(`npx ${prodCmd}`, { async: true });
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
  return { success: true };
}

module.exports = {
  commands,
  preHook
};
