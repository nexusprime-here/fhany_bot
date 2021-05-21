import { Client, Message } from "discord.js";
import database from "../database";
import embed from '../embeds/commands.reject';

const db: any = database;

module.exports = {
    name: 'rejeitar', 
    description: 'Rejeita uma sugestão e/ou apaga do canal sugestões',
    async execute(message: Message, args: string[], client: Client, config: any) {
        if(!await isStaff()) return deleteCommandMessage();
        if(!message.reference) return sendErrorMessageAndRemoveCommandMessage();
        if(!message.reference.messageID) return sendErrorMessageAndRemoveCommandMessage();

        const referenceMessage = (await message.channel.messages.fetch(message.reference?.messageID));

        alertSuggestionAuthor();
        deleteSuggestionMessage();
        deleteCommandMessage();
        sendSucessMessageAndRemoveMessage();


        /* Functions */
        function isStaff() {
            return new Promise<boolean>((terminated => {
                const guild = client.guilds.cache.get(config.guildId);
                const member = guild?.members.cache.find(member => member.id === message.author.id);
    
                member?.roles.cache.forEach(role => {
                    config.suggestion.permittedRoles.forEach((role2: string) => {
                        role.id === role2 && terminated(true);
                    })
                });

                terminated(false);
            }));
        };
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