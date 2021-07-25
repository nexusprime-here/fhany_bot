import { Message } from "discord.js";
const { version } = require('../../package.json');

module.exports = {
    name: 'versao',
    description: 'Mostra a versão atual do bot',
    execute(message: Message) {
        message.channel.send({ content: 'v' + version, components: [] });
    }
}