import { Client, CommandInteraction, GuildChannel, GuildMember, Message, VoiceChannel } from "discord.js";
import { IConfig, Command } from "..";
import db from '../database';

import embed from '../embeds/commands.createCall';

const createCall: Command = {
    name: 'criarcanal',
    description: 'Cria um canal exclusivo para você, onde você pode mudar as permissões e desconectar outros membros.',
    booster: true,
    options: [
        {
            name: 'tipo',
            description: 'O tipo do seu canal',
            type: 'STRING',
            choices: [
                {
                    name: 'Público',
                    value: 'publico'
                },
                {
                    name: 'Privado',
                    value: 'privado'
                }
            ],
        },
        {
            name: 'nome',
            description: 'Nome do canal',
            type: 'STRING',
        }
    ],
    async execute(this: { name: string }, interaction: CommandInteraction, config: IConfig) {
        const type = interaction.options.get('tipo')?.value;
        const channelName = interaction.options.get('nome')?.value;

        console.log('foi')
        if(!type || !channelName || typeof channelName !== 'string') return;
        console.log('foi2')
        
        const userInDatabase: IUserDb = db.get('boostersThatCreatedCalls').find({ userId: interaction.user.id }).value();
        
        if(channelName.length > 20) return interaction.reply({ embeds: [embed.nameVeryLarge] });
        else if(channelName.length < 1) return interaction.reply({ embeds: [embed.nameVerySmall] });
        
        if(!!userInDatabase) return interaction.reply({ embeds: [embed.alreadyCreated] });
        
        const everyone = interaction.guild?.roles.cache.get(interaction.guild.id)
        if(type !== 'publico' && type !== 'privado') return interaction.reply({ embeds: [embed.typeNotExist] });
        
        const channel = await createChannelVoice(type);
        if(!channel) return
        
        interaction.reply({ embeds: [embed.channelCreated(type === 'privado', channel.id)] })
        waitForUsersToJoin(channel, interaction.user.id);

            
        /* Functions */
        async function createChannelVoice(type: 'publico' | 'privado') {
            if(!everyone) return;
    
            const channel = await interaction.guild?.channels.create(`❖ ${channelName}`, {
                parent: config.booster.category,
                type: 'GUILD_VOICE',
                permissionOverwrites: type === 'publico' ? [
                    { 
                        id: everyone,
                        allow: ['VIEW_CHANNEL', 'CONNECT'] 
                    },
                    {
                        id: interaction.user.id,
                        allow: ['PRIORITY_SPEAKER', 'MOVE_MEMBERS', 'CREATE_INSTANT_INVITE']
                    }
                ] : [
                    {
                        id: everyone,
                        deny: ['VIEW_CHANNEL'],
                        allow: ['CONNECT']
                    },
                    {
                        id: interaction.user.id,
                        allow: ['VIEW_CHANNEL', 'PRIORITY_SPEAKER', 'MOVE_MEMBERS', 'CREATE_INSTANT_INVITE']
                    }
                ]
            });
    
            // config.staffers.forEach(staff => channel?.updateOverwrite(staff, { 'VIEW_CHANNEL': true, 'CONNECT': true }));
    
            !!channel && db.get('boostersThatCreatedCalls').push({ userId: interaction.user.id, channelId: channel.id }).write();
    
            return channel;
        }
    
        function waitForUsersToJoin(channel: VoiceChannel, userId: string) {
            if(channel === undefined) return;
    
            return new Promise(terminated => setTimeout(async () => {
                const usersInCall: GuildMember[] = [];
                channel.members.forEach((member: GuildMember) => {
                    usersInCall.push(member);
                });
        
                if(usersInCall.length < 1) {
                    !channel.deleted && channel.delete();
                    db.get('boostersThatCreatedCalls').remove({ userId: userId }).write();
        
                    terminated(null);
                }
            }, 1000 * 15));
        }
    }
}

module.exports = createCall;

/* Types */
type IUserDb = { userId: string, channelId: string } | undefined