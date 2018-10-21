<div style="text-align: center;">
    <img src="logo.png" width="300" />
</div>

# CReate A Node Application
## A CLI tool to create React + Node apps with just one command

:bulb: To get up and running with an application with a node.js backend and a React frontend, just execute:

```bash
npm i -g crana
crana <projectName> [projectFolder]
```

...and you are ready to go!

This will equip you with all important tools you're going to need to develop powerful applications, for example __Live reaload__ for the server and the frontend out of the box.
Webpack, Babel, ESLint, StyleLint, Nodemon etc. etc., all preconfigured out of the box, so that you can focus on the important stuff!

__Now start developing!__
```bash
crana dev
```
This will fire up the backend and the frontend development server. Just edit files under __src__ and see what happens!

## Usage
```bash
crana init <projectName> [projectFolderName]
```
Initialize a project.
```bash
crana dev                                     
```
Concurrently starts the frontend and the backend in development mode.
```bash
crana count-lines                            
```
See how many LOC you've already written.
```bash
crana lint:client                             
```
Executes eslint in autofix mode for your client files (src/client + src/shared).
```bash
crana lint:server                             
```
Executes eslint in autofix mode for your server files (src/server + src/shared).
```bash
crana dev:client                              
```
Starts the webpack development server for the frontend.
```bash
crana dev:server                              
```
Starts the node.js backend in development mode with live-reload.
```bash
crana start                                   
```
Starts the node.js server for production.
```bash
crana build:client                            
```
Creates a production build for the frontend application.

## Project structure
The interesting files for you are all located in the __src__ folder. The src folder has three subfolders:
- client
- server
- shared

As you can immagine, the __client__ folder contains all files for the React frontend application and the __server__ folder all files for the node.js backend. The __shared__ folder contains code you would like to share between client and server. This as good place for e.g. utility functions, domain logic etc.

Be aware that the server files are not transpiled and thus don't support certain features like ES6 imports. This also the reason why all code in the __shared__ folder must be executable with your current node.js version.

## Technologies
As soon as you bootstrapped a new project, you have an application running with:

- Node.js Backend
- React for frontend

Under the hood it uses Webpack, Babel, ESLint and StyleLint with a few other plugins enabling a powerful development workflow.

## Constraints
### Windows Linux Subsystem
If you're using Windows Linux Subsystem, eslint will not immediatly work. You need to edit the path under ".vscode/settings.json".
Replace "C:/mnt/c" with "C:" and it should work.

## Roadmap
- Improve documentations
- Use webpack for server too
- Implement possiblity to add own "app.it" plugins
