const AutoGitUpdate = require('auto-git-update');

const config = {
    repository: 'https://github.com/XNexusPrimeX/fhany_bot',
    token: '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',
    tempLocation: __dirname,
    executeOnComplete: __dirname + 'restart.bat',
    exitOnComplete: true
}

const updater = new AutoGitUpdate(config);

setInterval(async () => updater.autoUpdate(), 1000 * 60);