const app = require('express')();
const cp = require('child_process');
const restart = require('./restart');

app.get('/', (req, res) => {
	const date = new Date();

	console.log(`Ping recebido: ${date.getDate()}/${date.getMonth() + 1} às ${date.getHours() - 3}:${date.getMinutes()}`)
	res.sendStatus(200)
})


const config = {
	repository: 'https://github.com/XNexusPrimeX/fhany_bot',
	token: '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',
	tempLocation: __dirname + '/temp',		
	executeOnComplete: 'node restart.js',
	exitOnComplete: false
}

let oldClient;
setImmediate(async () => oldClient = await require('./dist/index').awaitClient.value);
setInterval(async () => oldClient = await restart(config, oldClient), 1000 * 5);

app.listen(process.env.PORT);