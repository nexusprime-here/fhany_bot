import { ClientUser, Message, MessageReaction } from "discord.js";

import db from "../database";

import embed from "../embeds/commands.trade"

module.exports = {
    name: 'trocar',
    description: '',
    async execute(message: Message, args: string[]) {
        const taggedUser = message.mentions.members?.first() || await message.guild?.members.fetch(args[0]);

        const tradeRequestMessage = await message.channel.send(embed.wantTrade(message.author));

        const acceptedReactions = ['✔', '❌'];
        // acceptedReactions.forEach(reaction => tradeRequestMessage.react(reaction));

        const filter = (reaction: MessageReaction, user: ClientUser) => acceptedReactions.includes(reaction.emoji.name);
        tradeRequestMessage.awaitReactions((reaction, user) => true, { max: 1, time: 1000 * 60 * 1, errors: ['time'] })
            .then(collected => {
                console.log('oi')
                const reaction = collected.first();

                console.log('oi');
                if(reaction?.emoji.name === '✔') message.reply('trocando...');
                else message.reply(embed.tradeReject);
            })
            .catch(() => tradeRequestMessage.edit(embed.timeIsOver) && tradeRequestMessage.reactions.removeAll());
    }
}


/* Functions */
function trade() {

}