import { GuildMember, MessageEmbed, User } from 'discord.js';
import { prefix } from '../config/configtest.json'

export default {
    notCreatedChannel: new MessageEmbed()
        .setTitle('❌ Crie um canal primeiro')
        .setDescription(`Para configurar uma call, você precisa ter uma, para criar, utilize o comando \`${prefix}createcall\``)
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    invalidOptions: (options: string[]) => new MessageEmbed()
        .setTitle('❌ Opção inválida')
        .setDescription('A opção que você selecionou é invalida, você pode escolher entre ' + options.join(' '))
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    sucessMessage: (userId: string, permission: string, boolean: boolean) => new MessageEmbed()
        .setTitle('✅ Sucesso!')
        .setDescription(`O usuário <@${userId}> teve uma a permissão \`${permission}\` mudado para o estado \`${boolean}\` com sucesso!`)
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
        
    isModerator: (options: string[]) => new MessageEmbed()
        .setTitle('❌ Usuário inválido')
        .setDescription('Você não pode mudar a permissão deste usuário porque ele faz parte da Staff')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>')
}