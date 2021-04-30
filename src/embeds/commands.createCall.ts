import { MessageEmbed } from "discord.js";

export default {
    nameVeryLarge: new MessageEmbed()
        .setTitle('❌ Nome muito grande')
        .setDescription('O nome do Canal está muito grande, não pode passar de 20 caracteres!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    typeNotExist: new MessageEmbed()
        .setTitle('❌ Tipo de canal inválido')
        .setDescription('O tipo do canal selecionado não existe, atualmente você pode selecionar entre: `public` e `private`.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    channelCreated: (privado: boolean, channelId: string) => new MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription(`O seu canal de voz ${privado ? 'privado' : 'público'} foi criado com sucesso. \n\n<#${channelId}>`)
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    alreadyCreated: new MessageEmbed()
        .setTitle('❌ Canal já existe')
        .setDescription('Você já tem um canal de voz, não pode criar outro enquanto ele existir.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
}