// const app = require('express')();
// const AutoGitUpdate = require('auto-git-update');
// const { exec } = require('child_process');

// app.get('/', (req, res) => {
// 	const date = new Date();

// 	console.log(`Ping recebido: ${date.getDate()}/${date.getMonth() + 1} às ${date.getHours() - 3}:${date.getMinutes()}`)
// 	res.sendStatus(200)
// })

// const config = {
// 	repository: 'https://github.com/XNexusPrimeX/fhany_bot',
// 	token: '?',
// 	tempLocation: __dirname + '/temp',		
// }
// const updater = new AutoGitUpdate(config);

// updater.setLogConfig({ logDebug: false, logDetail: false, logError: true });
    
// setImmediate(() => require('./dist/index'));
// setInterval(async () => {
// 	const notUpdated = (await updater.compareVersions()).upToDate;
// 	await updater.autoUpdate()

// 	if(notUpdated) return

// 	exec('npm run build', (error, _, sterr) => {
// 		if(error) return console.log(error);
// 		if(sterr) return console.log(sterr);

// 		requireUncached('./dist/index');
// 	});
// }, 1000 * 60 * 2);

// app.listen(process.env.PORT);


// function requireUncached(module) {
//     delete require.cache[require.resolve(module)];
//     return require(module);
// }
