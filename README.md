<div style="text-align: center;">
    <img src="logo.png" width="300" />
</div>

# :sparkles: CReate A Node Application
## :battery: A CLI tool to create React + Node apps with just one command (batteries included)

:bulb: To get up and running with an application with a node.js backend and a React frontend, just execute:

```bash
npm i -g crana
crana init <projectName> [projectFolder]
```

...and you are ready to go!

This will equip you with all important tools you're going to need to develop powerful applications, for example __Live reaload__ for the server and the frontend out of the box.
Webpack, Babel, ESLint, StyleLint, Nodemon etc. etc., all preconfigured out of the box, so that you can focus on the important stuff!

:computer: __Now start developing!__
```bash
crana dev
```
This will fire up the backend and the frontend development server. Just edit files under __src__ and see what happens!

:warning: Crana is in early stage of development and may not meet all your requirements. That's why contributions of any kind are highly appreciated, as the best tools are built by communities!

## Usage
:star: Create a new crana project.
```bash
crana init <projectName> [projectFolderName]
```
:dizzy: Concurrently starts the frontend and the backend in development mode.
```bash
crana dev                                     
```
:books: See how many LOC you've already written.
```bash
crana count-lines                            
```
:mag: Executes eslint and styleling in autofix mode for your client files (src/client + src/shared).
```bash
crana lint:client                             
```
:mag: Executes eslint in autofix mode for your server files (src/server + src/shared).
```bash
crana lint:server                             
```
:satellite: Starts the webpack development server for the frontend.
```bash
crana dev:client                              
```
:bar_chart: Starts the node.js backend in development mode with live-reload.
```bash
crana dev:server                              
```
:car: Starts the node.js server for production.
```bash
crana start                                   
```
:blue_car: Creates a production build for the frontend application.
```bash
crana build:client                            
```

## Project structure
The interesting files for you are all located in the __src__ folder. The src folder has three subfolders:
- client
- server
- shared

As you can imagine, the __client__ folder contains all files for the React frontend application and the __server__ folder contains all files for the node.js backend. The __shared__ folder contains code you would like to share between client and server. This is a good place for e.g. utility functions, domain logic etc.

Be aware that the server files are not transpiled and thus don't support certain features like ES6 imports. This also the reason why all code in the __shared__ folder must be executable with your current node.js version.

## Technologies
As soon as you bootstrapped a new project, you have an application running with:

- Node.js backend
- React for frontend

Under the hood it uses Webpack, Babel, ESLint and StyleLint with a few other plugins enabling a powerful development workflow.

## Known constraints/issues
### Windows Linux Subsystem
If you're using Windows Linux Subsystem, eslint will not immediatly work. You need to edit the path under `.vscode/settings.json`.
Replace `C:/mnt/c` with `C:` and it should work.

## Contributing
Have a look at [CONTRIBUTING.md](CONTRIBUTING.md)

## Code of conduct
Have a look at [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
