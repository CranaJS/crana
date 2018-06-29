const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

const { copyDir, replaceAll, colorize } = require('./util');

async function create({ projectName, projectFolderName }) {
    const folderNameToUse = projectFolderName ? projectFolderName : projectName;
    const pathToUse = path.resolve(process.cwd(), folderNameToUse);
    console.log(`Creating project ${colorize(projectName).FgCyan()} in ${colorize(pathToUse).FgCyan()}...`);

    const packageJSONTemplate = fs.readFileSync(path.resolve(__dirname, './templates/package.template.json'));
    const packageJSON = replaceAll(packageJSONTemplate.toString(), '{-- project-name --}', projectName);

    await copyDir({ source: path.resolve(__dirname, '..', 'files'), destination: pathToUse });

    // Create real package.json
    fs.writeFileSync(path.join(pathToUse, 'package.json'), packageJSON);

    // Install all dependencies
    setTimeout(() => {
        child_process.spawnSync('npm', ['install'], { cwd: pathToUse, stdio: 'inherit' });
        child_process.execSync('git init . && git add . && git commit -m "Initialized app with AppIt!"', { cwd: pathToUse });
        console.log(colorize('Dependencies were installed.').FgGreen());
        console.log(colorize('To get started, execute:').FgCyan())
        console.log(colorize(`cd ${folderNameToUse}`).Underscore());
        console.log(colorize(`npm run dev`).Underscore());
    }, 1000)
}

module.exports = create;