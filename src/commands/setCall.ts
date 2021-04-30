import { Message } from "discord.js";
import db from '../database';

import embed from '../embeds/commands.setCall';

module.exports = {
    name: 'setcall',
    description: '',
    args: true,
    usage: '<video/connect/invite> <true/false> @user',
    execute
}

function execute(message: Message, args: string[]) {
    const voiceChannel = getBoosterCall();
    if(!voiceChannel) return message.channel.send(embed.notCreatedChannel);

    const permissionsAccepted = {
        'ver': 'VIEW_CHANNEL',
        'conectar': 'CONNECT',
        'convidar': 'CREATE_INSTANT_INVITE',
        'video': 'STREAM'
    }

    const [ userPermission, boolean ] = args;

    if(userPermission === 'fechar' || userPermission === 'excluir') return function() {
        !voiceChannel.deleted && voiceChannel.delete();
        db.get('boostersThatCreatedCalls').remove({ channelId: voiceChannel.id }).write();
    }()

    if(userPermission !== 'ver' && userPermission !== 'conectar' && userPermission !== 'convidar' && userPermission !== 'video') return message.channel.send(embed.invalidOptions(Object.keys(permissionsAccepted)));
    const permission = permissionsAccepted[userPermission]

    const taggedUser = message.mentions.users.first();
    if(!taggedUser) return

    voiceChannel.updateOverwrite(taggedUser.id, {
        [permission]: boolean === 'true',
    }).then(() => {
        message.channel.send(embed.sucessMessage(taggedUser.id, permission, boolean));
    })


    /* Functions */
    function getBoosterCall() {
        const user = db.get('boostersThatCreatedCalls').find({ userId: message.author.id }).value();

        const call = message.guild?.channels.cache.get(user.channelId);

        return call?.type === 'voice' ? call : undefined;
    }
}