import { Message } from "discord.js";
import { globalCommon } from "../embeds/global";
import { ICommand } from "../handlers/commands";
const packageJson = require('../../package.json');

const version: ICommand = {
    active: true,
    name: 'versão',
    description: 'Mostra a versão atual do bot',
    forRoles: 'everyone',
    guildOnly: false,
    async execute(interaction) {
        const embed = globalCommon()
            .setTitle(`v${packageJson.version}`);

        interaction.reply({ embeds: [embed] });
    }
}

module.exports = version;