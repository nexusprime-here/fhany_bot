import { Command, IConfig } from "..";
import db from '../database';
import isStaffer from "../utils/isStaffer";

import embed from '../embeds/commands.boosterCall';
import { CommandInteraction, GuildMember, Role, VoiceChannel } from "discord.js";

const boosterCall: Command = {
    name: 'canalbooster',
    description: 'Para booster somente, cria/edita seu canal booster',
    booster: true,
    options: [
        {
            name: 'definir',
            description: 'Muda a Permissão de membros no seu canal Booster',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'membro',
                    description: 'O usuário que você quer modificar as permissões',
                    type: 'USER',
                    required: true
                },
                {
                    name: 'permissão',
                    description: 'Permissão que deseja modificar',
                    type: 'STRING',
                    choices: [
                        {
                            name: 'Ver',
                            value: 'VIEW_CHANNEL'
                        },
                        {
                            name: 'Conectar',
                            value: 'CONNECT'
                        },
                        {
                            name: 'Convidar',
                            value: 'CREATE_INSTANT_INVITE'
                        },
                        {
                            name: 'Transmitir',
                            value: 'STREAM'
                        }
                    ],
                    required: true
                },
                {
                    name: 'modo',
                    description: 'O modo da permissão, ou seja, desligar ou ligar.',
                    type: 'STRING',
                    choices: [
                        {
                            name: 'On',
                            value: 'true'
                        },
                        {
                            name: 'Off',
                            value: 'false'
                        }
                    ],
                    required: true
                },
            ]
        },
        {
            name: 'deletar',
            description: 'Deleta o Canal de Voz',
            type: 'SUB_COMMAND'
        },
        {
            name: 'criar',
            description: 'Cria um novo canal booster.',
            type: 'SUB_COMMAND',
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
                    required: true
                },
                {
                    name: 'nome',
                    description: 'Nome do canal',
                    type: 'STRING',
                    required: true
                }
            ]
        }
    ],
    async execute(interaction, config) {
        const subCommand = interaction.options.getSubCommand();
        
        if(subCommand === 'definir') {
            const voiceChannel = getBoosterCall(interaction);
            if(!voiceChannel) return interaction.reply({ embeds: [embed.notCreatedChannel] });

            const userPermission = interaction.options.get('permissão')?.value;
            const boolean = interaction.options.get('modo')?.value === true ? true : false;
            const taggedUser = interaction.options.get('membro')?.user;
            
            if(!taggedUser) return;
            
            const user = interaction.guild?.members.cache.get(taggedUser.id);
            if(await isStaffer(user, config)) return interaction.reply({ embeds: [embed.isModerator] });
        
            if(!userPermission || typeof userPermission !== 'string') return;
            await voiceChannel.permissionOverwrites.edit(taggedUser.id, {
                [userPermission]: boolean === true,
            });
            
            interaction.reply({ embeds: [embed.sucessMessage(taggedUser.id, userPermission, boolean)] });
            
        } else if(subCommand === 'deletar') {
            const voiceChannel = getBoosterCall(interaction);
            if(!voiceChannel) return interaction.reply({ embeds: [embed.notCreatedChannel] });

            !voiceChannel.deleted && voiceChannel.delete();
            db.get('boostersThatCreatedCalls').remove({ channelId: voiceChannel.id }).write();
    
            interaction.reply({ embeds: [embed.deleted] });

        } else if(subCommand === 'criar') {
            const type = interaction.options.get('tipo')?.value;
            const channelName = interaction.options.get('nome')?.value;
    
            if(!type || !channelName || typeof channelName !== 'string') return;

            const userInDatabase: IUserDb = db.get('boostersThatCreatedCalls').find({ userId: interaction.user.id }).value();
        
            if(channelName.length > 20) return interaction.reply({ embeds: [embed.nameVeryLarge] });
            else if(channelName.length < 1) return interaction.reply({ embeds: [embed.nameVerySmall] });
            
            if(!!userInDatabase) return interaction.reply({ embeds: [embed.alreadyCreated] });
            
            const everyone = interaction.guild?.roles.cache.get(interaction.guild.id)
            if(type !== 'publico' && type !== 'privado') return interaction.reply({ embeds: [embed.typeNotExist] });
            
            const channel = await createChannelVoice(type, everyone, channelName, interaction, config);
            if(!channel) return
            
            interaction.reply({ embeds: [embed.channelCreated(type === 'privado', channel.id)] })
            waitForUsersToJoin(channel, interaction.user.id);

        }
    }
}


/* Functions */
function getBoosterCall(interaction: CommandInteraction) {
    const user = db.get('boostersThatCreatedCalls').find({ userId: interaction.user.id }).value();

    const call = interaction.guild?.channels.cache.get(user?.channelId);

    return call?.type === 'GUILD_VOICE' ? call : undefined;
}
async function createChannelVoice(type: 'publico' | 'privado', everyone: Role | undefined, channelName: string, interaction: CommandInteraction, config: IConfig) {
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

    config.staffers.forEach((staff: `${bigint}`) => channel?.permissionOverwrites.edit(staff, { 
        'VIEW_CHANNEL': true, 'CONNECT': true 
    }));

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

module.exports = boosterCall;


/* Types */
type IUserDb = { userId: string, channelId: string } | undefined