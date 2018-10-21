const path = require('path');
const fs = require('fs');
const childProcess = require('child_process');

const { copyDir, replaceAll, colorize } = require('./util');
const { packageRootPath } = require('./paths');

async function create({ projectName, projectFolderName }) {
  const folderNameToUse = projectFolderName || projectName;
  const pathToUse = path.resolve(process.cwd(), folderNameToUse);
  console.log(`Creating project ${colorize(projectName).FgCyan()} in ${colorize(pathToUse).FgCyan()}...`);

  const packageJSONTemplate = fs.readFileSync(path.resolve(__dirname, './templates/package.template.json'));
  const packageJSON = replaceAll(packageJSONTemplate.toString(), '{-- project-name --}', projectName);

  await copyDir({ source: path.resolve(__dirname, '..', 'template'), destination: pathToUse });

  // Create real package.json
  fs.writeFileSync(path.join(pathToUse, 'package.json'), packageJSON);

  const vscodeConfigTemplate = fs.readFileSync(path.resolve(__dirname, './templates/settings.template.json'));
  const vscodeConfig = replaceAll(vscodeConfigTemplate.toString(), '{-- eslintrcPath --}', path.join(packageRootPath, '.eslintrc'));

  fs.writeFileSync(path.join(pathToUse, '.vscode/settings.json'), vscodeConfig);

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
