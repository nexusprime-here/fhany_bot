import { MessageEmbed, User } from "discord.js";

export default {
    notice: (category: { name: string, color: string }, content: string, author: User) => new MessageEmbed()
        .setTitle(`Aviso ${category.name === 'evento' || category.name === 'suporte' 
            ? `de ${category.name}` 
            : category.name}`
        )
        .setDescription(content)
        .setColor(category.color)
        .setFooter(`Escrito por: ${author.tag}`),

    wrongCategory: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Você não selecionou uma categoria válida. \n\nVocê pode escolher: `geral`, `evento` ou `suporte`.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    missingContent: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Você não pode enviar um aviso vazio.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    error: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Algo de errado aconteceu, tente novamente mais tarde!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    sucess: new MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription('Seu Aviso foi guardado com sucesso e será postado se os Administradores permitirem.')
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    notStaff: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Apenas staffers podem usar esse comando!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>')
}