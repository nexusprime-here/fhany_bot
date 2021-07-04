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
        .setDescription(`O usuário <@${userId}> teve a permissão \`${permission}\` mudado para o estado \`${boolean}\` com sucesso!`)
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
        
    isModerator: new MessageEmbed()
        .setTitle('❌ Usuário inválido')
        .setDescription('Você não pode mudar a permissão deste usuário porque ele faz parte da Staff.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    help: (prefix: string, command: string, mentionId: string | undefined) => new MessageEmbed()
        .setTitle(command)
        .setDescription(`Este comando modifica as permissões do seu canal exclusivo, que você pode criar com o comando \`${prefix}criarcanal\`. \n\nPara mudar a permissão de um usuário, você tem que dizer a permissão que quer modificar. \nVocê pode modificar 4 permissões: \`ver\`, \`conectar\`, \`convidar\` e \`transmitir\`. \n\nVocê pode ativar ou desativar a permissão com: \`on\` e \`off\`. \n\nPor último, Mencione o usuário que você quer mudar essas permissões. Ex: \n\n\`${prefix}${command} ver on <@${mentionId}>\``)
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>')
        .setColor('#F55EB3'),

    deleted: new MessageEmbed()
        .setTitle('✅ Sucesso!')
        .setDescription(`O canal foi apagado com sucesso!`)
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    
    notTaggedUser: new MessageEmbed()
        .setTitle('❌ Usuário inválido')
        .setDescription('Você não marcou um usuário válido')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
}