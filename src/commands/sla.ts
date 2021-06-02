import { Message } from "discord.js";

module.exports = {
    name: 'oi',
    description: 'Mostra a versão atual do bot',
    execute(message: Message) {
        message.channel.send('OII")
    }
}
