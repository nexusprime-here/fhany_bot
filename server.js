const app = require('express')();

app.get('/', (req, res) => {
	const date = new Date();

	console.log(`Ping recebido: ${date.getDate()}/${date.getMonth() + 1} às ${date.getHours() - 3}:${date.getMinutes()}`);
	res.sendStatus(200);
})

app.listen(process.env.PORT);