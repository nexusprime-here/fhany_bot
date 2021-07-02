import { Client, GuildChannel, GuildMember, Message } from "discord.js";
import { IConfig } from "..";
import db from '../database';

import embed from '../embeds/commands.createCall';

module.exports = {
    name: 'criarcanal',
    description: 'Cria um canal exclusivo para você, onde você pode mudar as permissões e desconectar outros membros.',
    booster: true,
    usage: '<publico/privado> [Nome do canal]',
    execute
}

async function execute(this: { name: string }, message: Message, args: string[], client: Client, config: IConfig) {
    const [ type, ...channelName ] = args;

    if(!type) return message.reply(embed.help(config.prefix, this.name))

    const userInDatabase: IUserDb = db.get('boostersThatCreatedCalls').find({ userId: message.author.id }).value();

    if(channelName.join(' ').length > 20) return message.channel.send(embed.nameVeryLarge);
    else if(channelName.join(' ').length < 1) return message.channel.send(embed.nameVerySmall);
    
    if(!!userInDatabase) return message.channel.send(embed.alreadyCreated)

    const everyone = message.guild?.roles.cache.get(message.guild.id)
    if(type !== 'publico' && type !== 'privado') return message.channel.send(embed.typeNotExist);

    createChannelVoice(type)?.then(channel => {
        if(!channel) return

        message.channel.send(embed.channelCreated(type === 'privado', channel.id))
        waitForUsersToJoin(channel, message.author.id);
    });


    /* Functions */
    async function createChannelVoice(type: 'publico' | 'privado') {
        if(!everyone) return;

        const channel = await message.guild?.channels.create(`❖ ${channelName.join(' ')}`, {
            parent: config.booster.category,
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
                }
            ]
        });

        config.staffers.forEach(staff => channel?.updateOverwrite(staff, { 'VIEW_CHANNEL': true, 'CONNECT': true }));

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