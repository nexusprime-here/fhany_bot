import { ApplicationCommandOptionChoice, Client, Message, TextChannel } from "discord.js";
import db from "../database";

import embed from '../embeds/commands.suggestion';
import { ISuggestionMessage } from "../features/suggestion";
import { ICommand } from "../handlers/commands";

const allMessagesList = fetchAllMessagesList();
const suggestion: ICommand = {
    active: true,
    name: 'sugestao',
    description: 'Com este comando você pode aceitar ou rejeitar uma sugestão.',
    forRoles: 'staff',
    guildOnly: true,
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
            description: 'Selecione a sugestão',
            type: 'STRING',
            choices: allMessagesList,
            required: true
        }
    ],
    async execute(interaction, config) {
        const option = <'accept' | 'reject'>interaction.options.get('opção')?.value;
        const suggestionId = <`${bigint}`>interaction.options.get('sugestão')?.value;

        if(interaction.channel?.type !== 'GUILD_TEXT') return;

        const suggestionChannel = <TextChannel | undefined>interaction.guild?.channels.cache.get(config.channels.suggestion);
        if(!suggestionChannel) return;

        const suggestionMessage = await findMessageTyped(suggestionId, suggestionChannel);
        if(!suggestionMessage) return;
        
        if(option === 'accept') {
            const id = suggestionMessage.embeds[0].footer?.text;
            if(!id) return;

            editSuggestionMessage(suggestionMessage);
            sendDataForDB(id);
            alertSuggestionAuthor(id, interaction.client, true);

            interaction.reply({ embeds: [embed.success(true)], ephemeral: true });
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
async function findMessageTyped(idOfMessage: string, channel: TextChannel) {
    console.log(await channel.messages.fetch())
    return (await channel.messages.fetch()).filter(message => 
        message.embeds[0]?.footer?.text === idOfMessage
    ).first();
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
function fetchAllMessagesList() {
    const allMessagesInDatabase: ISuggestionMessage[] = db.get('suggestionsCache').value();

    const allMessagesMapped: ApplicationCommandOptionChoice[] = allMessagesInDatabase.map(message => {
        const object = { 
            name: `[${message.author.username}]: ${message.content}`, 
            value: message.id 
        }

        object.name.length > 100 && (object.name = object.name.slice(0, 95) + '...');

        return object;
    });

    return allMessagesMapped;
}