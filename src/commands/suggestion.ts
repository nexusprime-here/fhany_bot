import { Client, CommandInteraction, GuildChannel, Message, TextChannel } from "discord.js";
import { Command } from "..";
import db from "../database";

import embed from '../embeds/commands.suggestion';

const suggestion: Command = {
    name: 'sugestao',
    description: 'Com este comando você pode aceitar ou rejeitar uma sugestão.',
    options: [
        {
            name: 'opção',
            description: 'Você pode aceitar ou rejeitar uma sugestão',
            type: 'STRING',
            choices: [
                {
                    name: 'aceitar',
                    value: 'accept'
                },
                {
                    name: 'rejeitar',
                    value: 'reject'
                },
            ],
            required: true
        },
        {
            name: 'sugestão',
            description: 'Digite o id da sugestão',
            type: 'STRING',
        }
    ],
    async execute(interaction) {
        const option = interaction.options.get('opção')?.value;
        const suggestion = interaction.options.get('sugestão')?.value;
        const channel = interaction.channel;

        if(typeof suggestion !== 'string' || channel?.type !== 'GUILD_TEXT') return;
        const suggestionMessage = await findMessageTyped(`${BigInt(suggestion)}`, channel);

        if(option === 'accept') {
            const id = suggestionMessage.embeds[0].footer?.text;
            if(!id) return;

            editSuggestionMessage(suggestionMessage);
            sendDataForDB(id);
            alertSuggestionAuthor(id, interaction.client, true);

            interaction.reply({ embeds: [embed.success(true)], ephemeral: true});
        } else if(option === 'reject') {
            const id = suggestionMessage.embeds[0].footer?.text;
            if(!id) return;
            
            alertSuggestionAuthor(id, interaction.client);
            deleteSuggestionMessage(suggestionMessage);   

            interaction.reply({ embeds: [embed.success()], ephemeral: true });
        }
    }
}

module.exports = suggestion;


/* Functions */
async function findMessageTyped(idOfMessage: `${bigint}`, channel: TextChannel) {
    return await channel.messages.fetch(idOfMessage);
}
function sendDataForDB(id: string | undefined) {
    if(!id) return;

    db.get('suggestionsCache').find({ id: id }).assign({ accept: true }).write();
}
function editSuggestionMessage(message: Message) {
    const { author, description, fields, footer } = message.embeds[0];

    if(!author || !description || !footer) return;

    message.edit({ embeds: [embed.editSuggestionMessage(author, message.embeds[0])], components: [] });
}
function alertSuggestionAuthor(id: string, client: Client, accepted?: boolean) {
    const userId = db.get('suggestionsCache').find({ id: id }).value().author.id;

    client.users.cache.get(userId)?.send({ embeds: [accepted ? embed.suggestionAccept : embed.suggestionReject] });
}
function deleteSuggestionMessage(referenceMessage: Message) {
    db.get('suggestionsCache').remove({ id: referenceMessage.embeds[0].footer?.text }).write()

    referenceMessage.delete();
}