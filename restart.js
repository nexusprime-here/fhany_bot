const cp = require('child_process')
const AutoGitUpdate = require('auto-git-update');

module.exports = async (config, oldClient) => {
    const updater = new AutoGitUpdate(config);
    
    const updatedSuccessfully = await updater.autoUpdate();
    if(updatedSuccessfully) return;
    oldClient.destroy();

    cp.exec('tsc', err => {
        if(err) throw err && process.exit(0);
    
        return require('./dist/index').client
    })
}