import Discord from 'discord.js';
import { Embed } from '../../main';
import cache from '../../database/cache';
import idCache from '../../database/ids';
import { ISubCommand } from "../../handlers/commands";

const subCommand: ISubCommand = async (interaction) => {
    const channelType = <'publico' | 'privado'>interaction.options.get('tipo')?.value;
    const channelName = <string>interaction.options.get('nome')?.value;
    
    const userInDatabase = cache.data.boosterCalls.find(call => call.userId === interaction.user.id);
    

    if(channelName.length > 30) return interaction.reply(Embed.create('Aviso', {
        title: 'Nome inválido',
        description: 'O nome do canal está muito grande, não pode passar de 30 caracteres!'
    }));
    if(channelName.length < 1) return interaction.reply(Embed.create('Aviso', {
        title: 'Nome inválido',
        description: 'O nome do canal está muito pequeno, tem que ter mais de 1 caractere!'
    }));
    if(userInDatabase) return interaction.reply(Embed.create('Aviso', {
        title: 'Canal de voz já existe',
        description: 'Você já tem um canal de voz, não pode criar outro enquanto ele existir.'
    }));
    

    let createdChannel = await createChannelVoice(channelName);
    if(!createdChannel) return;

    await setPermissionOfChannel(createdChannel, channelType);

    cache.data.boosterCalls.push({ channelId: createdChannel.id, userId: interaction.user.id });
    await cache.write();

    interaction.reply(Embed.create('Sucesso', {
        title: `Canal ${channelType ? 'privado' : 'público'} criado`,
        description: `Seu canal: <#${createdChannel.id}>\n\n*O canal pode ser apagado por inatividade*`
    }))


    /* Functions */
    async function createChannelVoice(channelName: string) {
        const categoryId = await idCache.get('boosterCallCategory');
        if(!categoryId) return interaction.reply(Embed.create('Erro', {
            title: 'Erro ao criar canal',
            description: 'Não foi possível criar o canal de voz, tente novamente mais tarde. \n\nErro: `Não foi possível encontrar a categoria de canais de voz`'
        }));

        const channel = await interaction.guild?.channels.create(`${process.env.BOOSTER_CALL_CHARACTER} ${channelName}`, {
            parent: categoryId,
            type: 'GUILD_VOICE'
        });
    
        return channel;
    }
    async function setPermissionOfChannel(channel: Discord.VoiceChannel, type: 'publico' | 'privado') {
        const everyoneRole = channel.guild.roles.everyone;
        const staffersRoles = (await idCache.get('roles'))?.staffers;

        if(!staffersRoles) {
            interaction.reply(Embed.create('Erro', {
                title: 'Erro ao criar canal',
                description: 'Não foi possível criar o canal de voz, tente novamente mais tarde. \n\nErro: `Não foi possível encontrar os cargos de staffers`'
            }));
        
            return false;
        }

        const permissions: Discord.OverwriteResolvable[] = staffersRoles.map(staff => ({ 
            id: staff, 
            allow: [
                'DEAFEN_MEMBERS', 
                'MOVE_MEMBERS', 
                'MUTE_MEMBERS', 
                'PRIORITY_SPEAKER',
                'MANAGE_CHANNELS',
                'VIEW_CHANNEL'
            ]
        }));

        permissions.push(
            {
                id: interaction.user.id,
                allow: ['VIEW_CHANNEL', 'PRIORITY_SPEAKER', 'MOVE_MEMBERS', 'CREATE_INSTANT_INVITE']
            },
            type === 'publico'
                ? {
                    id: everyoneRole,
                    allow: ['VIEW_CHANNEL', 'CONNECT']
                }
                : {
                    id: everyoneRole,
                    deny: ['VIEW_CHANNEL'],
                    allow: ['CONNECT']
                }
        )
    
        return !!await channel.permissionOverwrites.set(permissions);
    }
}

export default subCommand;