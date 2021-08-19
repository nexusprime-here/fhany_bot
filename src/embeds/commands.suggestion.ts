import { EmbedFieldData, MessageEmbed, MessageEmbedAuthor, MessageEmbedFooter, User } from "discord.js";
import { globalCommon, globalSuccess } from "./global";

export default {
    success: (accept?: boolean) => globalSuccess()
        .setDescription(`A sugestão que você marcou foi ${accept ? 'aceita' : 'rejeitada'} com sucesso!`),

    editSuggestionMessage: (user: MessageEmbedAuthor, embed: MessageEmbed) => new MessageEmbed()
        .setAuthor(user.name ? user.name : '', user.iconURL ? user.iconURL : '')
        .setTitle('Aceito')
        .setDescription(embed.description ? embed.description : '')
        .addFields(embed.fields)
        .setFooter(embed.footer?.text ? embed.footer.text : '')
        .setColor('#00FF00'),

    suggestionAccept: globalCommon()
        .setDescription('Oba! Sua sugestão foi aceita pela staff! Continue assim!!'),

    suggestionReject: globalCommon()
        .setDescription('Sua sugestão não foi aceita e a staff prefiriu removê-la.'),
}