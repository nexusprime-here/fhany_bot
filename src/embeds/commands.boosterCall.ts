import { GuildMember, MessageEmbed, User } from 'discord.js';
import { globalCommon, globalError, globalSuccess, globalWarn } from './global';

export default {
    notCreatedChannel: globalError()
        .setDescription(`Para configurar um canal de voz, você precisa ter uma. Para criar, utilize o comando \`/canalbooster criar\``),

    successMessage: (userId: string, permission: string, boolean: boolean) => globalSuccess()
        .setDescription(`O usuário <@${userId}> teve a permissão \`${permission}\` mudado para o estado \`${boolean}\` com sucesso!`),
        
    isModerator: globalError()
        .setDescription('Você não pode mudar a permissão deste usuário porque ele faz parte da Staff.'),

    deleted: globalSuccess()
        .setDescription(`O canal foi apagado com sucesso!`),
    
    nameVeryLarge: globalError()
        .setDescription('O nome do canal está muito grande, não pode passar de 20 caracteres!'),

    channelCreated: (privado: boolean, channelId: string) => globalSuccess()
        .setDescription(`O seu canal de voz ${privado ? 'privado' : 'público'} foi criado com sucesso. \n\n<#${channelId}>`),

    alreadyCreated: globalError()
        .setDescription('Você já tem um canal de voz, não pode criar outro enquanto ele existir.'),

    nameVerySmall: globalError()
        .setDescription('O nome do canal está muito pequeno, tem que ter mais de 1 caractere!'),

    isStreaming: globalWarn()
        .setDescription('O usuário já está transmitindo sua tela. O Discord não para a transmissão do usuário mesmo mudando a permissão, deseja Desconectar o usuário para parar a transmissão? \n\nNa próxima vez que o usuário voltar ele não poderá transmitir.'),

    removedStream: globalSuccess()
        .setDescription('O usuário foi desconectado com sucesso! \n\nNa próxima vez que o usuário voltar ele não poderá transmitir.')
}