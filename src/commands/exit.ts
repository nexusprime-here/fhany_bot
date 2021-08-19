import { Message } from "discord.js";
import { ICommand } from "../handlers/commands";

const exit: ICommand = {
    active: true,
    name: 'exit',
    description: 'Termina o processo, só pode ser usado pelo Criador.',
    forRoles: 'everyone',
    guildOnly: false,
    async execute(interaction) {
        if(interaction.user.id !== '607999934725357578') return ;

        await interaction.reply({ content: 'Process exited' });
        process.exit(0);
    }
}

module.exports = exit;