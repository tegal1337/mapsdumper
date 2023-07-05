/**
 * @version 1.0.0
 * @license MIT
 * @example node index.js
 * @author: Abdul Muttaqin
 */
function Logger(message, color) {
    const timeString = `\x1b[37m[${new Date().toLocaleTimeString()}]\x1b[0m`;

    switch(color){
        case "red":
            // red
            console.log(`${timeString} \x1b[1;31m${message}\x1b[0m`);
            break;
        case "yellow":
            // yellow
            console.log(`${timeString} \x1b[1;33m${message}\x1b[0m`);
            break;
        case "green":
            // bright green
            console.log(`${timeString} \x1b[1;32m${message}\x1b[0m`);
            break;
        default:
            // default white
            console.log(`${timeString} \x1b[1;37m${message}\x1b[0m`);
            break;
    }
}

module.exports = {
    Logger
}
