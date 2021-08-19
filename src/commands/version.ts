import { Message } from "discord.js";
import { ICommand } from "../handlers/commands";
const packageJson = require('../../package.json');

const version: ICommand = {
    active: true,
    name: 'versão',
    description: 'Mostra a versão atual do bot',
    forRoles: 'everyone',
    guildOnly: false,
    execute(interaction) {
        interaction.reply({ content: 'v' + packageJson.version });
    }
}

module.exports = version;