# App.It
## A CLI tool to create React + Node apps with just one command

Just do:

```bash
npm i -g app-it
app-it <projectName> [projectFolder]
```

...and you are ready to go!

It is going to install all needed dependencies and accordingly setup your project.

## Technologies
As soon as you bootstrapped a new Project, you have an application running with:

- Node.js Backend (tranpiled by babel)
- React for frontend

Under the hood it uses Webpack, Babel, ESLint and StyleLint with a few other plugins enabling a powerful development workflow.

## Usage
App-It offers several useful commands. To execute a command, use:
```bash
npm run <command-name>
```

- __dev__
    - Concurrently executes "client:dev" and "server:dev". Everything you need to start developing powerful apps.
- __client:dev__
    - Starts the webpack-dev-server
- __client:build__
    - Create an optimized production build of your bundle
- __client:lint__
    - Lints all your client code, and most importantly, auto-fixes it.
- __server:dev__
    - Starts the nodejs server in development mode with auto-reload enabled
- __server:build__
    - Builds all server files so that they can be executed without babel
- __server:lint__
    - Lints and auto-fixes all server related files.
- __server:prod__
    - Executed built server files for production
- __heroku:deploy__
    - Automatically build server + client and deploy it on Heroku
- __count-lines__
    - Shows how many lines of code you've alread written.


## Roadmap
- Scripts should be implemented internally: All dependencies should be installed internally. So updating isn't an issue anymore.
- Use webpack for server too
- Better decouple source folder from "app.it"
- Implement possiblity to add own "app.it" plugins
- Implement updating to a newer version of "app.it"