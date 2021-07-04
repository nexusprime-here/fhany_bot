import { Client, Message } from "discord.js";
import { IConfig } from "..";
import db from '../database';
import isStaffer from "../utils/isStaffer";

import embed from '../embeds/commands.setCall';

module.exports = {
    name: 'setcanal',
    description: 'Modifica permissões de usuários',
    booster: true,
    usage: '<transmitir/conectar/convidar/ver> <on/off> @user',
    execute
}

async function execute(this: { name: string }, message: Message, args: string[], client: Client, config: IConfig) {
    const permissionsAccepted = {
        'ver': 'VIEW_CHANNEL',
        'conectar': 'CONNECT',
        'convidar': 'CREATE_INSTANT_INVITE',
        'transmitir': 'STREAM'
    }
    const [ userPermission, keymode ] = args;

    if(!userPermission) return message.reply(embed.help(config.prefix, this.name, message.client.user?.id))
    
    const voiceChannel = getBoosterCall();
    if(!voiceChannel) return message.channel.send(embed.notCreatedChannel);

    const boolean = keymode === 'on' ? true : false;

    if(userPermission === 'fechar' || userPermission === 'excluir') return function() {
        !voiceChannel.deleted && voiceChannel.delete();
        db.get('boostersThatCreatedCalls').remove({ channelId: voiceChannel.id }).write();

        message.channel.send(embed.deleted);
    }();

    if(userPermission !== 'ver' && userPermission !== 'conectar' && userPermission !== 'convidar' && userPermission !== 'transmitir') return message.channel.send(embed.invalidOptions(Object.keys(permissionsAccepted)));

    const permission = permissionsAccepted[userPermission];

    const taggedUser = message.mentions.users.first();
    if(!taggedUser) return embed.notTaggedUser;

    const user = message.guild?.members.cache.get(taggedUser.id);
    if(await isStaffer(user, config)) return message.reply(embed.isModerator);

    voiceChannel.updateOverwrite(taggedUser.id, {
        [permission]: boolean === true,
    }).then(() => message.channel.send(embed.sucessMessage(taggedUser.id, permission, boolean)));


    /* Functions */
    function getBoosterCall() {
        const user = db.get('boostersThatCreatedCalls').find({ userId: message.author.id }).value();

        const call = message.guild?.channels.cache.get(user?.channelId);

        return call?.type === 'voice' ? call : undefined;
    }
}