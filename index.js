#!/usr/bin/env node
const program = require('commander');

const createProject = require('./src/create');
const { commands, preHook } = require('./src/scripts');
const { log, colorize } = require('./src/util');

program
  .version('0.0.6')
  .description('Create client + server apps with one CLI command. Easy. Unobstrusive. Powerful. Flexible.');

program
  .command('init <projectName> [projectFolderName]')
  .description('Initialize a project.')
  .action((projectName, projectFolderName) => {
    createProject({ projectName, projectFolderName });
  });

commands.forEach(({ name, fn, description = '' }) => {
  program
    .command(name)
    .description(description)
    .action(async () => {
      const { error } = await preHook();
      if (!error)
        fn();
      else
        log({ text: colorize(error).FgRed(), type: 'error' });
    });
});

program.parse(process.argv);
