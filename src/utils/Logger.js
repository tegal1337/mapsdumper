function Logger(message, color) {
    // Create the time string and reset the color after
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
