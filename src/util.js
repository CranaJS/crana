const { ncp } = require('ncp');

function copyDir({ source, destination }) {
    return new Promise((resolve, reject) => {
        ncp(source, destination, (err) => {
            if (err) {
                console.error('Error while copying folder contents.', err);
                reject(err);
                return;
            }
            resolve();
        });
    });
}

function replaceAll(str, what, withThat) {
    let retStr = str;
    while (retStr.includes(what))
        retStr = retStr.replace(what, withThat);
    return retStr;
}

function colorize(str) {

    const colorsMods = {
        Reset: "\x1b[0m",
        Bright : "\x1b[1m",
        Dim : "\x1b[2m",
        Underscore : "\x1b[4m",
        Blink : "\x1b[5m",
        Reverse : "\x1b[7m",
        Hidden : "\x1b[8m",

        FgBlack : "\x1b[30m",
        FgRed : "\x1b[31m",
        FgGreen : "\x1b[32m",
        FgYellow : "\x1b[33m",
        FgBlue : "\x1b[34m",
        FgMagenta : "\x1b[35m",
        FgCyan : "\x1b[36m",
        FgWhite : "\x1b[37m",

        BgBlack : "\x1b[40m",
        BgRed : "\x1b[41m",
        BgGreen : "\x1b[42m",
        BgYellow : "\x1b[43m",
        BgBlue : "\x1b[44m",
        BgMagenta : "\x1b[45m",
        BgCyan : "\x1b[46m",
        BgWhite : "\x1b[47m"
    };

    const retObj = {};

    Object.keys(colorsMods).forEach((mod) => {
        retObj[mod] = () => `${colorsMods[mod]}${str}${colorsMods.Reset}`
    });

    return retObj;
}

module.exports = {
    copyDir,
    replaceAll,
    colorize
};