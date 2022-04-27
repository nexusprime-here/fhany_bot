import Discord from 'discord.js';
import { Embed } from '../../main';
import cache from '../../database/cache';
import { createCommand } from "../../handlers/commands";

export default createCommand({
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
                    name: 'visibilidade',
                    description: 'Muda a visibilidade para "everyone"',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'visibilidade',
                            description: 'a visibilidade do seu canal de voz',
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
    async execute(interaction) {
        const subCommand = function() {
            try {
                return interaction.options.getSubcommandGroup()
            } catch {
                return interaction.options.getSubcommand();
            }
        }();
        const voiceChannelOfUser = await getBoosterChannelInCache();

        const acceptedSubCommands: { [subCommand: string]: () => any } = {
            'criar': () => executeSubCommand('create', interaction),
            'definir': () => executeSubCommand('define', interaction, voiceChannelOfUser),
            'deletar': () => executeSubCommand('delete', interaction, voiceChannelOfUser),
            'convidar': () => executeSubCommand('invite', interaction, voiceChannelOfUser)
        };
        acceptedSubCommands[subCommand]();


        async function getBoosterChannelInCache() {
            await cache.read();
            const user = cache.data.boosterCalls.find(call => call.userId === interaction.user.id);

            if(!user) return;
        
            const channelOfUser = interaction.guild?.channels.cache.get(user.channelId);
        
            return channelOfUser?.type === 'GUILD_VOICE' ? channelOfUser : undefined;
        }
    }
})

export function ifNotExistsChannelThrowError(voiceChannel: Discord.VoiceChannel, interaction: Discord.CommandInteraction) {
    if(!voiceChannel) {
        interaction.reply(Embed.create('Erro', {
            title: 'Canal de Voz não existe',
            description: `Para configurar um canal de voz, você precisa ter um. Para criar, utilize o comando \`/canalbooster criar\``
        }));

        return true;
    }

    return false;
}
async function executeSubCommand(file: string, interaction: Discord.CommandInteraction, ...args: any[]) {
    (await import(`./${file}`)).default(interaction, ...args);
}