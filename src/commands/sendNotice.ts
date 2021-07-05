import { Client, Message } from "discord.js";
import { IConfig } from "..";

import embed from '../embeds/commands.sendNotice';
import db from '../database';
import isStaffer from "../utils/isStaffer";

module.exports = {
    name: 'enviaraviso',
    description: '',
    args: true,
    async execute(message: Message, args: string[], client: Client, config: IConfig) {
        if(!await isStaffer(message.guild?.members.cache.get(message.author.id), config)) return message.reply(embed.notStaff);

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

        if(selectedCategory.length < 1) return message.reply(embed.wrongCategory);
        if(content.length < 1) return message.reply(embed.missingContent);

        const admChannel = message.guild?.channels.cache.get(config.sendNotice.admChannel);
        const noticeChannel = message.guild?.channels.cache.get(config.sendNotice.noticeChannel);
        const selectedChannel = (() => {
            const member = message.guild?.members.cache.get(message.author.id);

            return member?.permissions.has('ADMINISTRATOR') ? noticeChannel : admChannel;
        })();

        const sucessEmbed = embed.notice(selectedCategory[0], content.join(' '), message.author);
        selectedChannel?.isText() && selectedChannel.send(selectedChannel === noticeChannel ? '@everyone' : '', { embed: sucessEmbed })
            .then(msg => {
                if(selectedChannel !== admChannel) return;

                db.get('noticesNotAnswered').push({ authorId: message.author.id, messageId: msg.id, embed: sucessEmbed }).write()
                message.reply(embed.sucess);
            })
            .catch(() => message.reply(embed.error));
    }
}