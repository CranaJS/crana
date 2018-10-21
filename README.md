# App.It
## A CLI tool to create React + Node apps with just one command

Just execute:

```bash
npm i -g app-it
app-it <projectName> [projectFolder]
```

...and you are ready to go!

It is going to install all needed dependencies and accordingly setup your project.

## Technologies
As soon as you bootstrapped a new Project, you have an application running with:

- Node.js Backend
- React for frontend

Under the hood it uses Webpack, Babel, ESLint and StyleLint with a few other plugins enabling a powerful development workflow.

## Constraints
### Windows Linux Subsystem
If you're using Windows Linux Subsystem, eslint will not immediatly work. You need to edit the path under ".vscode/settings.json".
Replace "C:/mnt/c" with "C:" and it should work.

## Roadmap
- Write clear documentation
- Use webpack for server too
- Implement possiblity to add own "app.it" plugins
