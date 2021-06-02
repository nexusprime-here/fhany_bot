const cp = require('child_process')
const AutoGitUpdate = require('auto-git-update');
const index = require('./dist/index');

module.exports = async config => {
    console.log('foi')
    const updater = new AutoGitUpdate(config);
    
    const notUpdated = (await updater.compareVersions()).upToDate
    await updater.autoUpdate();

    if(notUpdated) return;
    await index.client.destroy();

    cp.exec('tsc', err => {
        if(err) throw err && process.exit(0);
    
        index.client.login(index.token);
    });
}