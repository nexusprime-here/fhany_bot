import chalk from "chalk";

function getTime() {
    const date = new Date();

    function transformTwoDigitsLen(digits: number) {
        return ('0' + digits).slice(-2);
    }
    
    const hours = transformTwoDigitsLen(date.getHours());
    const minutes = transformTwoDigitsLen(date.getMinutes());
    const seconds = transformTwoDigitsLen(date.getSeconds());

    return `${hours}:${minutes}:${seconds}`;
}

export default {
    warn(...args: any[]) {
        console.warn(chalk.black.bgYellow(`[WARN ${getTime()}]`) + chalk.yellow(' >>'), ...args);
    },
    error(message: string, error?: Error, path?: string) {
        console.error(chalk.black.bgRed(`\n[ERROR ${getTime()}]`) + chalk.red(' >>'), message);
        console.log(chalk.red(`At ${path ?? _getCallerFile()}`))
        error && console.error(error);
    },
    log(message: string, ...args: any[]) {
        console.log(chalk.black.bgBlue(`[LOG ${getTime()}]`) + chalk.blue(' >>'), message);
        args.forEach(arg => console.log(arg));
    }
}

function _getCallerFile() {
    var originalFunc = Error.prepareStackTrace;

    var callerfile;
    try {
        var err = new Error();
        var currentfile;

        Error.prepareStackTrace = function (err, stack) { return stack; };

        // @ts-ignore
        currentfile = err.stack?.shift().getFileName();
        
        while (err.stack?.length) {
            // @ts-ignore
            callerfile = err.stack?.shift().getFileName();

            if(currentfile !== callerfile) break;
        }
    } catch (e) {}

    Error.prepareStackTrace = originalFunc; 

    return callerfile;
}