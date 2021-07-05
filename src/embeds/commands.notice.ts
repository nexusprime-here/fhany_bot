import { MessageEmbed } from "discord.js";

export default {
    notReplied: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Você não marcou nenhuma mensagem, para aceitar ou rejeitar um Aviso, responda a mensagem do aviso.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    isntNotice: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('A mensagem que você marcou não é um aviso registrada.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    sucess: (isRejected: boolean) => new MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription(`O aviso foi ${isRejected ? 'rejeitado' : 'publicado'} com sucesso!`)
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    accepted: new MessageEmbed()
        .setTitle('Aviso aceito')
        .setDescription(`O seu aviso foi aceito e publicado!`)
        .setColor('#F55EB3')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    rejected: (content: string) => new MessageEmbed()
        .setTitle('Aviso rejeitado')
        .setDescription(`O seu aviso foi rejeitado${content.length > 1 ? ` pelo seguinte motivo: *"${content}"*` : '.'}`)
        .setColor('#F55EB3')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    invalidArg: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Você só pode `aceitar` ou `rejeitar` uma notícia!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    notAdmin: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Apenas administradores podem usar esse comando!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
}