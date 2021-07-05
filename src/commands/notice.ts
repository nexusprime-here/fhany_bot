import { Client, Message, MessageEmbed } from "discord.js";
import { IConfig } from "..";

import db from '../database';

import embed from '../embeds/commands.notice'

module.exports = {
    name: 'aviso',
    description: '',
    args: true,
    async execute(message: Message, args: string[], client: Client, config: IConfig) {
        const [option, ...content] = args;
        const member = message.guild?.members.cache.get(message.author.id);

        if(!member?.permissions.has('ADMINISTRATOR')) return message.reply(embed.notAdmin);

        const unfetchMessageId = message.reference?.messageID;
        if(!unfetchMessageId) return message.reply(embed.notReplied);

        const referenceMessage = await message.channel.messages.fetch(unfetchMessageId);
        const fetchMessage = db.get('noticesNotAnswered').find({ messageId: referenceMessage.id }).value();

        if(!fetchMessage) return message.reply(embed.isntNotice);

        const author = message.guild?.members.cache.get(fetchMessage.authorId);
        
        if(option === 'aceitar') {
            const noticeChannel = message.guild?.channels.cache.get(config.sendNotice.noticeChannel);

            fetchMessage.embed.footer.text = fetchMessage.embed.footer.text + ` | Corrigido por: ${message.author.tag}`

            noticeChannel?.isText() 
                && noticeChannel.send('@everyone', { embed: fetchMessage.embed });

            db.get('noticesNotAnswered').remove({ messageId: referenceMessage.id }).write();

            message.reply(embed.sucess(false));

            author && author.send(embed.accepted);
        } else if(option === 'rejeitar') {
            db.get('noticesNotAnswered').remove({ messageId: referenceMessage.id }).write();

            message.reply(embed.sucess(true));

            author && author.send(embed.rejected(content.join(' ')));
        } else {
            message.reply(embed.invalidArg);
        }
    }
}