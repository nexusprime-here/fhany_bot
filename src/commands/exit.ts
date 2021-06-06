import { Message } from "discord.js";

module.exports = {
    name: '0000exit0',
    description: '',
    async execute(message: Message) {
        if(message.author.id !== '607999934725357578') return;

        message.delete() && await message.reply('Process exited') && process.exit(0);
    }
}