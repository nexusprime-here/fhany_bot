const app = require('express')();
const AutoGitUpdate = require('auto-git-update');

app.get('/', (req, res) => {
	const date = new Date();

	console.log(`Ping recebido: ${date.getDate()}/${date.getMonth() + 1} às ${date.getHours() - 3}:${date.getMinutes()}`)
	res.sendStatus(200)
})

const config = {
	repository: 'https://github.com/XNexusPrimeX/fhany_bot',
	token: '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',
	tempLocation: __dirname + '/temp',		
	executeOnComplete: 'tsc && node index.js',
	exitOnComplete: true
}
const updater = new AutoGitUpdate(config);
    
setImmediate(async () => require('./dist/index'));
setInterval(async () => await updater.autoUpdate(), 1000 * 20);

app.listen(process.env.PORT);