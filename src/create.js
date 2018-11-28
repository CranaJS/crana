const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');
const inquirer = require('inquirer');

const { copyDir, replaceAll, colorize } = require('./util');
const { packageRootPath } = require('./paths');
const getExtensionsList = require('./extensions/ls');

async function create({ projectName, projectFolderName }) {
  const folderNameToUse = projectFolderName || projectName;
  const pathToUse = path.resolve(process.cwd(), folderNameToUse);
  console.log(`Creating project ${colorize(projectName).FgCyan()} in ${colorize(pathToUse).FgCyan()}...`);

  // Create packageJSON content
  const packageJSONTemplate = fs.readFileSync(path.resolve(__dirname, './templates/package.template.json'));
  const packageJSON = replaceAll(packageJSONTemplate.toString(), '{-- project-name --}', projectName);
  // Copy default template directory to project folder
  await copyDir({ source: path.resolve(__dirname, '..', 'default-template'), destination: pathToUse });

  // Create real package.json
  fs.writeFileSync(path.join(pathToUse, 'package.json'), packageJSON);

  // Let user select extensions
  const extensions = getExtensionsList();
  const { extensions: extensionsToInstall } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'extensions',
      message: 'Which extensions do you want to install?',
      choices: extensions.map(ext => ext.extension.name)
    }
  ]);
  // Create crana.config.js in project folder with extensions listed
  const cranaConfigContent = `
    module.exports = {
      extensions: ${JSON.stringify(extensionsToInstall)},
      extend: {}
    }
  `;

  fs.writeFileSync(path.join(pathToUse, 'crana.config.js'), cranaConfigContent);

  // Setup VSCode config
  const vscodeConfigTemplate = fs.readFileSync(path.resolve(__dirname, './templates/settings.template.json'));
  const vscodeConfig = replaceAll(vscodeConfigTemplate.toString(), '{-- eslintrcPath --}', path.join(packageRootPath, '.eslintrctemp'));

  const vscodeFolder = path.join(pathToUse, '.vscode');
  if (!fs.existsSync(vscodeFolder))
    fs.mkdirSync(vscodeFolder);

  fs.writeFileSync(path.join(vscodeFolder, 'settings.json'), vscodeConfig);

  // Install all dependencies
  setTimeout(() => {
    childProcess.spawnSync('npm', ['install'], { cwd: pathToUse, stdio: 'inherit' });
    childProcess.execSync('git init . && git add . && git commit -m "Initialized app with crana!"', { cwd: pathToUse });
    console.log(colorize('Project was successfully created.').FgGreen());
    console.log(colorize('To get started, execute:').FgCyan());
    console.log(colorize(`cd ${folderNameToUse}`).Underscore());
    console.log(colorize('crana dev').Underscore());
  }, 300);
}

module.exports = create;
