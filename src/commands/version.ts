import { Message } from "discord.js";
import { Command } from "..";
const packageJson = require('../../package.json');

const version: Command = {
    name: 'versão',
    description: 'Mostra a versão atual do bot',
    execute(interaction) {
        interaction.reply({ content: 'v' + packageJson.version });
    }
}

module.exports = version;