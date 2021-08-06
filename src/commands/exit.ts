import { Message } from "discord.js";
import { Command } from "..";

const exit: Command = {
    name: '0000exit0',
    description: '.',
    async execute(interaction) {
        if(interaction.user.id !== '607999934725357578') return;

        await interaction.reply({ content: 'Process exited' });
        process.exit(0);
    }
}

module.exports = exit;