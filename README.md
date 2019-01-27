<div style="text-align: center;">
    <img src="logo.png" width="300" />
</div>

# :sparkles: CReate A Node Application
## :battery: A CLI tool to create React + Node apps with just one command (batteries included)

[![Maintainability](https://api.codeclimate.com/v1/badges/e02fed19f69c47fbb3ae/maintainability)](https://codeclimate.com/github/pankaryp/crana/maintainability)

* [Technologies](#technologies)
* [Quick Start](#quick-start)
* [Usage](#usage)
    * [Main Commands](#main-commands)
    * [Util Commands](#util-commands)
* [Project Structure](#project-structure)
* [Known Issues](#known-issues)
    * [Windows Linux Subsystem](#windows-linux-subsystem)
* [Contributing](#contributing)
* [License](#license)
* [Code of Conduct](#code-of-conduct)

## Technologies
As soon as you bootstrap a new project, you will have an application running with:

- Node.js backend
- React.js frontend

Under the hood it uses Webpack, Babel, ESLint and StyleLint with a few other plugins enabling a powerful development workflow, such as server live reload with nodemon and more. All preconfigured out of the box, so that you can focus on the important stuff!

## Quick Start
:bulb: To get up and running with your first Crana app, fist install Crana globally:

```bash
npm i -g crana
```

Initialize your app
```bash
crana init <projectName> [projectFolder]
```

...and you are ready to go!

:computer: __Now start developing!__
```bash
crana dev
```
This will fire up the frontend and the backend concurrently in development mode.. Just edit files under __src__ and see what happens!

## Usage

### Basic Commands

| Command | Description |
| --- | --- |
| crana -V | Outputs crana's version |
| crana -h | Show availavle commands |

### Main Commands

| Command | Description |
| --- | --- |
| :star: crana init <projectName> [projectFolderName] | Create a new crana project |
| :dizzy: crana dev | Concurrently starts the frontend and the backend in development mode |
| :satellite: crana dev:client | Starts the webpack development server for the frontend |
| :bar_chart: crana dev:server | Starts the node.js backend in development mode with live-reload |
| :blue_car: crana build:client | Creates a production build for the frontend application |

### Util Commands

| Command | Description |
| --- | --- |
| :mag: crana lint:client | Executes eslint and styleling in autofix mode for your client files (src/client + src/shared) |
| :mag: crana lint:server | Executes eslint in autofix mode for your server files (src/server + src/shared) |
| :books: crana count-lines | See how many LOC you've already written |

## Project structure
The interesting files for you are all located in the __src__ folder. The src folder has three subfolders:
- client
- server
- shared

As you can imagine, the __client__ folder contains all files for React and the __server__ folder contains all files for Node.js backend. The __shared__ folder contains code you would like to share between client and server. This is a good place for e.g. utility functions, domain logic etc.

_NOTE:Be aware that the server files are not transpiled and thus don't support certain features like ES6 imports. This also the reason why all code in the __shared__ folder must be executable with your current node.js version._

## Known issues

### Windows Linux Subsystem
If you're using Windows Linux Subsystem, eslint will not immediatly work. You need to edit the path under `.vscode/settings.json`.
Replace `C:/mnt/c` with `C:` and it should work.

## Contributing
:warning: Crana is in early stage of development and may not meet all your requirements. That's why contributions of any kind are highly appreciated, as the best tools are built by communities!

Pull requests are always welcome. Please have a look at [CONTRIBUTING.md](CONTRIBUTING.md) and
open an issue before submitting a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Code of conduct
Have a look at [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
