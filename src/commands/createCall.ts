import { GuildChannel, GuildMember, Message } from "discord.js";
import db from '../database';

import embed from '../embeds/commands.createCall';

module.exports = {
    name: 'createcall',
    description: '',
    args: true,
    usage: '<public/private> [Nome do canal]',
    roles: ['779054882916925480'],
    execute
}

function execute(message: Message, args: string[]) {
    const [ type, ...channelName ] = args;

    const userInDatabase: IUserDb = db.get('boostersThatCreatedCalls').find({ userId: message.author.id }).value();

    if(channelName.join(' ').length > 20) return message.channel.send(embed.nameVeryLarge);
    
    if(!!userInDatabase) return message.channel.send(embed.alreadyCreated)

    const everyone = message.guild?.roles.everyone.id;

    if(type === 'public' || type === 'private') {
        createChannelVoice(type)?.then(channel => {
            if(!channel) return

            message.channel.send(embed.channelCreated(type === 'private', channel?.id))
            waitForUsersToJoin(channel, message.author.id);
        });
    }
    else { 
        message.channel.send(embed.typeNotExist);
    }


    async function createChannelVoice(type: 'public' | 'private') {
        if(!everyone) return

        const channel = await message.guild?.channels.create(`❖ ${channelName.join(' ')}`, {
            parent: '772812962854338564',
            type: 'voice',
            permissionOverwrites: type === 'public' ? [
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