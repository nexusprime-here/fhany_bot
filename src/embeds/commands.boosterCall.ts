import { GuildMember, MessageEmbed, User } from 'discord.js';
import { globalCommon, globalError, globalSuccess, globalWarn } from './global';

export default {
    notCreatedChannel: globalError('Canal de Voz não existe')
        .setDescription(`Para configurar um canal de voz, você precisa ter um. Para criar, utilize o comando \`/canalbooster criar\``),

    successMessage: (userId: string, permission: string, boolean: boolean) => globalSuccess('Permissão de usuário modificado')
        .setDescription(`O usuário <@${userId}> teve a permissão \`${permission}\` mudado para o estado \`${boolean}\` com sucesso!`),
        
    isModerator: globalError('Usuário inválido')
        .setDescription('Você não pode mudar a permissão deste usuário porque ele faz parte da Staff.'),

    deleted: globalSuccess('Canal apagado'),
    
    nameVeryLarge: globalError('Nome inválido')
        .setDescription('O nome do canal está muito grande, não pode passar de 30 caracteres!'),

    channelCreated: (privado: boolean, channelId: string) => globalSuccess(`Canal ${privado ? 'privado' : 'público'} criado`)
        .setDescription(`Seu canal: <#${channelId}>`),

    alreadyCreated: globalError('Canal de voz já existe')
        .setDescription('Você já tem um canal de voz, não pode criar outro enquanto ele existir.'),

    nameVerySmall: globalError('Nome inválido')
        .setDescription('O nome do canal está muito pequeno, tem que ter mais de 1 caractere!'),

    isStreaming: globalWarn()
        .setDescription('O usuário já está transmitindo sua tela. O Discord não para a transmissão do usuário mesmo mudando a permissão, deseja Desconectar o usuário para parar a transmissão? \n\nNa próxima vez que o usuário voltar ele não poderá transmitir.'),

    removedStream: globalSuccess('Usuário desconectado')
        .setDescription('Na próxima vez que o usuário conectar neste Canal de Voz, ele não poderá transmitir.'),

    invited: globalSuccess('Usuário Convidado'),

    DmIsClosed: globalWarn()
        .setDescription('A DM(Mensagem Direta) do usuário está fechada, as permissões foram concedidas para o usuário mas o convite não pode ser enviado.'),

    nameChanged: globalSuccess('Nome do Canal de Voz modificado'),

    typeChanged: (type: 'publico' | 'privado') => globalSuccess(`Tipo do canal de Voz modificado para ${type === 'publico' ? 'Público' : 'Privado'}`),
    
    error: (err: string) => globalError('Não foi possível executar esse comando, tente novamente mais tarde.')
        .setDescription(`Motivo do erro: ${err}`)
}