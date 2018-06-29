#!/usr/bin/env node
const program = require('commander');

const createProject = require('./src/create');

program
    .version('0.0.1')
    .description('Create client + server apps with one CLI command. Easy. Unobstrusive. Powerful. Flexible.');

program
    .arguments('<projectName> [projectFolderName]')
    .description('Initialize a project.')
    .alias('init')
    .action((projectName, projectFolderName) => {
        createProject({ projectName, projectFolderName });
    });

program.parse(process.argv);