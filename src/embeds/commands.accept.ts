import { EmbedFieldData, MessageEmbed, MessageEmbedAuthor, MessageEmbedFooter } from "discord.js";

export default {
    notExistMessageReference: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Você esqueceu de marcar uma sugestão!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    suggestionAccept: new MessageEmbed()
        .setTitle('Sugestão aceita!')
        .setDescription('Oba! Sua sugestão foi aceita pela staff! Continue assim!!')
        .setColor('#F55EB3')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    sucess: new MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription('A sugestão que você marcou foi aceita com sucesso!')
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    editSuggestionMessage: (author: MessageEmbedAuthor, description: string, fields: EmbedFieldData[], footer: MessageEmbedFooter) => new MessageEmbed()
        .setAuthor(author.name, author.iconURL)
        .setTitle('Aceito')
        .setDescription(description)
        .addFields(fields)
        .setFooter(footer.text)
        .setColor('#00FF00')
}