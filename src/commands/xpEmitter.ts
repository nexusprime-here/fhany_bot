import { Client, Message } from "discord.js";
import { IConfig, seasonPass } from "..";

import embed from '../embeds/commands.addXp';

module.exports = {
    name: 'addxp',
    description: 'Adiciona xp a um membro.',
    args: true,
    staff: true,
    async execute(message: Message, args: string[], client: Client, config: IConfig) {
        const quantity: number | typeof NaN = parseInt(args[1]);
        const member = message.guild?.members.cache.get(message.author.id);

        if (!args[0]) return message.reply({ embeds: [embed.hasNotReceiver] })

        const receiver = message.mentions.members?.first() || await message.guild?.members.get(args[0]);
        
        if (!receiver) return message.reply({ embeds: [embed.memberNotFound] });
        if (!quantity) return message.reply({ embeds: [embed.invalidXp] });
        
        seasonPass.emit('xpUpdate', message.member, quantity); 
        message.channel.send({ embeds: [embed.sucess(quantity, member, receiver)] });
    }
}