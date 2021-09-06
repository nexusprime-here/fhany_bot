import { MessageEmbed } from "discord.js";
import { ISuggestionMessage } from "../features/suggestion";
import { globalCommon, globalError, globalSuccess } from "./global";

const acceptedCategories: { [category in ISuggestionMessage['category']]: string } = {
    forFhany: 'Para o canal da Fhany',
    forServer: 'Para o Servidor'
}

export default {
    messageSent: (userId: string) => new MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription(`<@${userId}>, sua sugestão foi enviada com sucesso! \nEm 15 minutos ou menos, ela irá aparecer nas sugestões.`)
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    reactionSent: new MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription('Sua avaliação foi enviada com sucesso! \nEm 10 minutos ou menos, ela irá aparecer na mensagem reagida.')
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    
    suggestion: (suggestion: ISuggestionMessage, category: ISuggestionMessage['category']) => globalCommon()
        .setTitle(acceptedCategories[category])
        .setAuthor(suggestion.author.username, suggestion.icon || undefined)
        .setDescription(suggestion.content)
        .setFooter(suggestion.id)
        .setColor(suggestion.accept ? '#00FF00' : category === 'forServer' ? '#F55EB3' : '#6318db')
        .addFields([
            {
                name: 'ㅤ', // invisible keys, this isn't spaces
                value: `👍 | ${suggestion.likes.length}`,
                inline: true
            },
            {
                name: 'ㅤ',
                value: `👎 | ${suggestion.dislikes.length}`,
                inline: true
            }
        ]),

    alreadyRated: globalError()
        .setDescription('Você já votou nessa mensagem.'),

    success: globalSuccess()
        .setDescription('Voto enviado!')
}