import Discord from 'discord.js';
import { ifNotExistsChannelThrowError } from '.';
import { Embed } from '../../main';
import { ISubCommand } from "../../handlers/commands";
import isStaffer from '../../utils/isStaffer';

const subCommand: ISubCommand = async (interaction, voiceChannelOfUser: Discord.VoiceChannel) => {
    const subCommand = interaction.options.getSubcommand();

    if(subCommand === 'permissão') {
        if(ifNotExistsChannelThrowError(voiceChannelOfUser, interaction)) return;
        
        const selectedPermission = <Discord.PermissionString>interaction.options.getString('permissão', true);
        const boolean = interaction.options.getBoolean('modo', true);
        const taggedMember = <Discord.GuildMember>interaction.options.getMember('membro', true);
        
        if(await isStaffer(taggedMember)) return interaction.reply(Embed.create('Erro', {
            title: 'Usuário inválido',
            description: 'Você não pode mudar a permissão deste usuário porque ele faz parte da Staff.'
        }));
        
        await voiceChannelOfUser.permissionOverwrites.edit(taggedMember.id, {
            [selectedPermission]: boolean,
        });
        
        await interaction.reply(Embed.create('Sucesso', {
            title: 'Permissão de usuário modificado',
            description: `O usuário <@${taggedMember.id}> teve a permissão \`${selectedPermission}\` mudado para o estado \`${boolean}\` com sucesso!`
        }));
        
        if(selectedPermission === 'STREAM' && isStreaming(taggedMember)) {
            const followUp = <Discord.Message>await interaction.followUp(Embed.create('Aviso', 
                'O usuário já está transmitindo sua tela. O Discord não para a transmissão do usuário mesmo mudando a permissão, deseja Desconectar o usuário para parar a transmissão? \n\nNa próxima vez que o usuário voltar ele não poderá transmitir.',
                {
                    components: [
                        new Discord.MessageActionRow().addComponents(
                            new Discord.MessageButton()
                            .setLabel(`Ok`)
                            .setStyle("PRIMARY")
                            .setCustomId('accept')
                        )
                    ]
                }
            ));
                
            followUp.awaitMessageComponent({ filter: i => i.isButton() && i.customId === 'accept', time: 1000 * 60 })
                .then(interaction => {
                    taggedMember?.voice.setChannel(null);
                    
                    interaction.reply(Embed.create('Sucesso', {
                        title: 'Usuário desconectado',
                        description: 'Na próxima vez que o usuário conectar neste Canal de Voz, ele não poderá transmitir.'
                    }));
                })
                .catch(() => followUp.delete());
        }
    } else if(subCommand === 'visibilidade') {
        if(!voiceChannelOfUser) return interaction.reply(Embed.create('Erro', {
            title: 'Canal de Voz não existe',
            description: `Para configurar um canal de voz, você precisa ter um. Para criar, utilize o comando \`/canalbooster criar\``
        }));
    
        const channelType = <'publico' | 'privado'>interaction.options.get('visibilidade')?.value;
        const everyone = interaction.guild?.roles.everyone;
    
        if(!everyone) return;
    
        channelType === 'publico' 
            ? voiceChannelOfUser.permissionOverwrites.edit(everyone, { VIEW_CHANNEL: true, CONNECT: true })
            : voiceChannelOfUser.permissionOverwrites.edit(everyone, { VIEW_CHANNEL: false, CONNECT: true });
    
        interaction.reply(Embed.create('Sucesso', `Tipo do canal de Voz modificado para ${channelType === 'publico' ? 'Público' : 'Privado'}`))
    } else if(subCommand === 'nome') {
        if(!voiceChannelOfUser) return interaction.reply(Embed.create('Erro', {
            title: 'Canal de Voz não existe',
            description: `Para configurar um canal de voz, você precisa ter um. Para criar, utilize o comando \`/canalbooster criar\``
        }));
    
        const channelName = interaction.options.getString('nome', true);
    
        if(channelName.length > 30) return interaction.reply(Embed.create('Erro', {
            title: 'Nome inválido',
            description: 'O nome do canal está muito grande, não pode passar de 30 caracteres!'
        }));
        else if(channelName.length < 1) return interaction.reply(Embed.create('Erro', {
            title: 'Nome inválido',
            description: 'O nome do canal está muito pequeno, tem que ter mais de 1 caractere!'
        }));
    
        voiceChannelOfUser.setName(`❖ ${channelName}`);
    
        interaction.reply(Embed.create('Sucesso', 'Nome do Canal de Voz modificado'));
    }
}

export default subCommand;


function isStreaming(member: Discord.GuildMember | undefined) {
    const activities = member?.presence?.activities.filter(activity => activity.type === 'STREAMING')

    if(!activities || activities.length === 0) return false;

    return true;
}