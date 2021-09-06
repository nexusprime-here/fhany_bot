import { IConfig } from "..";
import db from '../database';
import isStaffer from "../utils/isStaffer";
import Discord from 'discord.js';

import embed from '../embeds/commands.boosterCall';
import { CommandInteraction, GuildMember, MessageActionRow, MessageButton, Role, VoiceChannel } from "discord.js";
import { ICommand } from "../handlers/commands";

const boosterCall: ICommand = {
    active: true,
    name: 'canalbooster',
    description: 'Para booster somente, cria/edita seu canal booster',
    forRoles: 'booster',
    guildOnly: true,
    options: [
        {
            name: 'definir',
            description: 'Muda as configurações do canal booster',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'permissão',
                    description: 'Muda a Permissão de um membro no seu canal Booster',
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
                            type: 'BOOLEAN',
                            required: true
                        }
                    ]
                },
                {
                    name: 'nome',
                    description: 'Muda o nome do seu canal de voz',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'nome',
                            description: 'O novo nome do seu canal de voz',
                            type: 'STRING',
                            required: true
                        }
                    ]
                },
                {
                    name: 'tipo',
                    description: 'Muda a visibilidade para "everyone"',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'tipo',
                            description: 'O tipo do seu canal de voz',
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
                        }
                    ]
                }
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
        },
        {
            name: 'convidar',
            description: 'Convida um membro para o canal, se o canal for privado, a permissão de ver e conectar é concedida.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'membro',
                    description: 'O membro que vai ser convidado para o canal',
                    type: 'USER',
                    required: true
                }
            ]
        }
    ],
    async execute(interaction, config) {
        const subCommand = interaction.options.getSubcommand();
        const voiceChannelOfUser = <Discord.VoiceChannel>getBoosterCallInDatabase(interaction);
        
        if(subCommand === 'permissão') {
            if(!voiceChannelOfUser) return interaction.reply({ embeds: [embed.notCreatedChannel] });
            
            const selectedPermission = <Discord.PermissionString>interaction.options.getString('permissão');
            const boolean = interaction.options.getBoolean('modo', true);
            const taggedMember = <Discord.GuildMember>interaction.options.getMember('membro', true);
            
            if(await isStaffer(taggedMember, config)) return interaction.reply({ embeds: [embed.isModerator] });
            
            await voiceChannelOfUser.permissionOverwrites.edit(taggedMember.id, {
                [selectedPermission]: boolean,
            });
            
            await interaction.reply({ embeds: [embed.successMessage(taggedMember.id, selectedPermission, boolean)] });
            
            if(selectedPermission === 'STREAM' && isStreaming(taggedMember)) {
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                    .setLabel(`Ok`)
                    .setStyle("PRIMARY")
                    .setCustomId('accept')
                )
                    
                const followUp = <Discord.Message>await interaction.followUp({ embeds: [embed.isStreaming], components: [row] });
                    
                followUp.awaitMessageComponent({ filter: i => i.isButton() && i.customId === 'accept', time: 1000 * 60 })
                    .then(interaction => {
                        taggedMember?.voice.setChannel(null);
                        
                        interaction.reply({ embeds: [embed.removedStream] });
                    })
                    .catch(() => followUp.delete());
            }
                
        } else if(subCommand === 'deletar') {
            const voiceChannel = getBoosterCallInDatabase(interaction);
            if(!voiceChannel) return interaction.reply({ embeds: [embed.notCreatedChannel] });
                
            !voiceChannel.deleted && voiceChannel.delete();
            db.get('boostersThatCreatedCalls').remove({ channelId: voiceChannel.id }).write();
            
            interaction.reply({ embeds: [embed.deleted] });
            
        } else if(subCommand === 'criar') {
            const channelType = <'publico' | 'privado'>interaction.options.get('tipo')?.value;
            const channelName = <string>interaction.options.get('nome')?.value;
            
            const userInDatabase: IUserDb = db.get('boostersThatCreatedCalls').find({ userId: interaction.user.id }).value();
            
            if(channelName.length > 30) return interaction.reply({ embeds: [embed.nameVeryLarge] });
            else if(channelName.length < 1) return interaction.reply({ embeds: [embed.nameVerySmall] });
            if(userInDatabase) return interaction.reply({ embeds: [embed.alreadyCreated] });
            
            const everyone = interaction.guild?.roles.cache.get(interaction.guild.id);
            
            const createdChannel = await createChannelVoice(channelType, everyone, channelName, interaction, config);
            if(!createdChannel) return embed.error('Canal não foi criado');
            
            interaction.reply({ embeds: [embed.channelCreated(channelType === 'privado', createdChannel.id)] });
            waitForUsersToJoin(createdChannel, interaction.user.id);
        } else if(subCommand === 'convidar') {
            if(!voiceChannelOfUser) return interaction.reply({ embeds: [embed.notCreatedChannel] });

            const member = <Discord.GuildMember>interaction.options.getMember('membro', true);
        
            await voiceChannelOfUser.permissionOverwrites.edit(member, {
                CONNECT: true,
                VIEW_CHANNEL: true
            });

            const invite = await voiceChannelOfUser.createInvite({ maxUses: 1 });

            member.send(`${invite.url}`)
                .then(() => interaction.reply({ embeds: [embed.invited] }))
                .catch(() => interaction.reply({ embeds: [embed.DmIsClosed] }));
        } else if(subCommand === 'nome') {
            if(!voiceChannelOfUser) return interaction.reply({ embeds: [embed.notCreatedChannel] });

            const channelName = interaction.options.getString('nome', true);

            if(channelName.length > 30) return interaction.reply({ embeds: [embed.nameVeryLarge] });
            else if(channelName.length < 1) return interaction.reply({ embeds: [embed.nameVerySmall] });

            voiceChannelOfUser.setName(`❖ ${channelName}`);

            interaction.reply({ embeds: [embed.nameChanged] });
        } else if(subCommand === 'tipo') {
            if(!voiceChannelOfUser) return interaction.reply({ embeds: [embed.notCreatedChannel] });

            const channelType = <'publico' | 'privado'>interaction.options.get('tipo')?.value;
            const everyone = interaction.guild?.roles.everyone;

            if(!everyone) return;

            channelType === 'publico' 
                ? voiceChannelOfUser.permissionOverwrites.edit(everyone, { VIEW_CHANNEL: true, CONNECT: true })
                : voiceChannelOfUser.permissionOverwrites.edit(everyone, { VIEW_CHANNEL: false, CONNECT: true });

            interaction.reply({ embeds: [embed.typeChanged(channelType)] })
        }
    }
}

module.exports = boosterCall;


/* Functions */
function isStreaming(member: GuildMember | undefined) {
    const activities = member?.presence?.activities.filter(activity => activity.type === 'STREAMING')

    if(!activities || activities.length === 0) return false;

    return true;
}
function getBoosterCallInDatabase(interaction: CommandInteraction) {
    const user = db.get('boostersThatCreatedCalls').find({ userId: interaction.user.id }).value();

    const call = interaction.guild?.channels.cache.get(user?.channelId);

    return call?.type === 'GUILD_VOICE' ? call : undefined;
}
async function createChannelVoice(type: 'publico' | 'privado', everyone: Role | undefined, channelName: string, interaction: CommandInteraction, config: IConfig) {
    if(!everyone) return;

    const channel = await interaction.guild?.channels.create(`❖ ${channelName}`, {
        parent: config.commands.boosterCall.category,
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

    config.roles.staffers.forEach(staff => channel?.permissionOverwrites.edit(staff, { 
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



/* Types */
type IUserDb = { userId: string, channelId: string } | undefined