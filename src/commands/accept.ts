import { Client, Message } from "discord.js";
import { IConfig } from "..";
import database from '../database';
import embed from '../embeds/commands.accept';
import isStaffer from "../utils/isStaffer";

const db: any = database

module.exports = {
    name: 'aceitar', 
    description: 'Aceita uma sugestão do canal sugestões',
    guildOnly: true,
    async execute(message: Message, args: string[], client: Client, config: IConfig) {
        const member = message.guild?.members.cache.get(message.author.id);
        if(!await isStaffer(member, config)) return deleteCommandMessage();
        if(!message.reference) return sendErrorMessageAndRemoveCommandMessage();
        if(!message.reference.messageID) return sendErrorMessageAndRemoveCommandMessage();

        const referenceMessage = await message.channel.messages.fetch(message.reference?.messageID);

        editSuggestionMessage();
        sendDataForDB();
        alertSuggestionAuthor();
        deleteCommandMessage();
        sendSucessMessageAndRemoveMessage();


        /* Functions */
        function sendDataForDB() {
            db.get('suggestionsCache').find({ id: referenceMessage.embeds[0].footer?.text }).assign({ accept: true }).write();
        }
        function deleteCommandMessage() {
            message.delete();
        }
        async function sendSucessMessageAndRemoveMessage() {
            const thisMessage = await message.channel.send(embed.sucess);

            setTimeout(() => thisMessage.delete(), 5000);
        }
        function sendErrorMessageAndRemoveCommandMessage() {
            message.reply(embed.notExistMessageReference)
                .then(msg => setTimeout(() => msg.delete(), 1000 * 5));

            message.delete();
        }
        function editSuggestionMessage() {
            const { author, description, fields, footer } = referenceMessage.embeds[0];

            if(!author || !description || !footer) return;

            referenceMessage.edit(embed.editSuggestionMessage(author, description, fields, footer));
        }
        function alertSuggestionAuthor() {
            const userId = db.get('suggestionsCache').find({ id: referenceMessage.embeds[0].footer?.text }).value().author.id;

            message.client.users.cache.get(userId)?.send(embed.suggestionAccept);
        }
    }
}