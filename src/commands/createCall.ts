import { GuildChannel, GuildMember, Message } from "discord.js";
import db from '../database';

import embed from '../embeds/commands.createCall';

module.exports = {
    name: 'createcall',
    description: 'Cria um canal exclusivo para você, onde você pode mudar as permissões e desconectar outros membros.',
    booster: true,
    usage: '<publico/privado> [Nome do canal]',
    execute
}

async function execute(message: Message, args: string[]) {
    const [ type, ...channelName ] = args;

    if(!type) return message.reply(embed.help)

    const userInDatabase: IUserDb = db.get('boostersThatCreatedCalls').find({ userId: message.author.id }).value();

    if(channelName.join(' ').length > 20) return message.channel.send(embed.nameVeryLarge);
    
    if(!!userInDatabase) return message.channel.send(embed.alreadyCreated)

    const everyone = message.guild?.roles.everyone.id;

    if(type === 'publico' || type === 'privado') {
        createChannelVoice(type)?.then(channel => {
            if(!channel) return

            message.channel.send(embed.channelCreated(type === 'privado', channel?.id))
            waitForUsersToJoin(channel, message.author.id);
        });
    }
    else { 
        message.channel.send(embed.typeNotExist);
    }


    async function createChannelVoice(type: 'publico' | 'privado') {
        if(!everyone) return

        const moderator = '748601213079126027'

        const channel = await message.guild?.channels.create(`❖ ${channelName.join(' ')}`, {
            parent: '772812962854338564',
            type: 'voice',
            permissionOverwrites: type === 'publico' ? [
                { 
                    id: everyone,
                    allow: ['VIEW_CHANNEL', 'CONNECT'] 
                },
                {
                    id: message.author.id,
                    allow: ['PRIORITY_SPEAKER', 'MOVE_MEMBERS', 'CREATE_INSTANT_INVITE']
                }
            ] : [
                {
                    id: everyone,
                    deny: ['VIEW_CHANNEL'],
                    allow: ['CONNECT']
                },
                {
                    id: message.author.id,
                    allow: ['VIEW_CHANNEL', 'PRIORITY_SPEAKER', 'MOVE_MEMBERS', 'CREATE_INSTANT_INVITE']
                },
                {
                    id: moderator,
                    allow: ['VIEW_CHANNEL', 'CONNECT']
                }
            ]
        });

        !!channel && db.get('boostersThatCreatedCalls').push({ userId: message.author.id, channelId: channel.id }).write();

        return channel;
    }

    function waitForUsersToJoin(channel: GuildChannel, userId: string) {
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

/* Types */
type IUserDb = { userId: string, channelId: string } | undefined