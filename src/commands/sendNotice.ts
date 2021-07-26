import { Client, Message, MessageActionRow, MessageButton } from "discord.js";
import { IConfig } from "..";

import embed from '../embeds/commands.sendNotice';
import db from '../database';
import isStaffer from "../utils/isStaffer";

module.exports = {
    name: 'enviaraviso',
    description: '',
    args: true,
    async execute(message: Message, args: string[], client: Client, config: IConfig) {
        if(!await isStaffer(message.guild?.members.cache.get(message.author.id), config)) return message.reply({ embeds: [embed.notStaff] });

        const [ userCategory, ...content ] = args;

        const acceptedCategories = [
            {
                name: 'geral',
                color: '#ff3355'
            }, {
                name: 'evento',
                color: '#ffc933'
            }, {
                name: 'suporte',
                color: '#b5c6c7'
            }
        ];

        const selectedCategory = acceptedCategories.filter(category => category.name === userCategory);

        if(selectedCategory.length < 1) return message.reply({ embeds: [embed.wrongCategory] });
        if(content.length < 1) return message.reply({ embeds: [embed.missingContent] });

        const admChannel = message.guild?.channels.cache.find(channel => channel.id === config.sendNotice.admChannel);
        const noticeChannel = message.guild?.channels.cache.find(channel => channel.id === config.sendNotice.noticeChannel);
        const selectedChannel = (() => {
            const member = message.guild?.members.cache.get(message.author.id);

            return member?.permissions.has('ADMINISTRATOR') ? noticeChannel : admChannel;
        })();

        const sucessEmbed = embed.notice(selectedCategory[0], content.join(' '), message.author);

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel(`Aceitar`)
                .setStyle("SUCCESS")
                .setCustomId('like'),
                
            new MessageButton()
                .setLabel('Rejeitar')
                .setStyle("DANGER")
                .setCustomId('dislike')
        );

        selectedChannel?.isText() && selectedChannel.send({ content: selectedChannel === noticeChannel ? '@everyone' : '', embeds: [sucessEmbed], components: [row] })
            .then(msg => {
                if(selectedChannel !== admChannel) return;

                db.get('noticesNotAnswered').push({ authorId: message.author.id, messageId: msg.id, embed: sucessEmbed }).write()
                message.reply({ embeds: [embed.sucess] });
            })
            .catch(() => message.reply({ embeds: [embed.error] }));
    }
}