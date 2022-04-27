import { createCommand } from "../handlers/commands";
import { Embed } from "../main";

export default createCommand({
    active: false,
    name: "shop",
    description: "Mostra o menu de compras",
    forRoles: "everyone",
    guildOnly: true,
    async execute(interaction) {
        interaction.reply(Embed.create('Info', {
            title: 'Loja',
            description: 'A loja está em desenvolvimento'
        }));
    }
})