# App.It
## A CLI tool to create React + Node apps with just one command

Just execute:

```bash
npm i -g app-it
app-it <projectName> [projectFolder]
```

...and you are ready to go!

## Technologies
As soon as you bootstrapped a new Project, you have an application running with:

- Node.js Backend
- React for frontend

## Constraints
### Windows Linux Subsystem
If you're using Windows Linux Subsystem, eslint will not immediatly work. You need to edit the path under ".vscode/settings.json".
Replace "C:/mnt/c" with "C:" and it should work.

## Roadmap
- Create better documentation
- Use webpack for server too
- Implement possiblity to add own "app.it" plugins
