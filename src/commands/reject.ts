import { Client, Message } from "discord.js";
import database from "../database";
import embed from '../embeds/commands.reject';
import isStaffer from "../utils/isStaffer";

const db: any = database;

module.exports = {
    name: 'rejeitar', 
    description: 'Rejeita uma sugestão e/ou apaga do canal sugestões',
    guildOnly: true,
    async execute(message: Message, args: string[], client: Client, config: any) {
        const member = message.guild?.members.cache.get(message.author.id);
        if(!await isStaffer(member, config)) return deleteCommandMessage();
        if(!message.reference) return sendErrorMessageAndRemoveCommandMessage();
        if(!message.reference.messageID) return sendErrorMessageAndRemoveCommandMessage();

        const referenceMessage = (await message.channel.messages.fetch(message.reference?.messageID));

        alertSuggestionAuthor();
        deleteSuggestionMessage();
        deleteCommandMessage();
        sendSucessMessageAndRemoveMessage();


        /* Functions */
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
        function deleteSuggestionMessage() {
            db.get('suggestionsCache').remove({ id: referenceMessage.embeds[0].footer?.text }).write()

            referenceMessage.delete();
        }
        function alertSuggestionAuthor() {
            const userId = db.get('suggestionsCache').find({ id: referenceMessage.embeds[0].footer?.text }).value().author.id;

            message.client.users.cache.get(userId)?.send(embed.suggestionReject);
        }
    }
}