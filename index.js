const express = require('express');
const app = express();

app.get('/', (req, res) => {
	const date = new Date();

	console.log(`Ping recebido: ${date.getDay()}/${date.getMonth()} às ${date.getHours()}:${date.getMinutes()}`)
	res.sendStatus(200)
})

app.listen(process.env.PORT)

require('./dist/index');