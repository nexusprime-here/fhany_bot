import { Client, Message } from "discord.js";
import { IConfig } from "..";
import db from '../database';

import embed from '../embeds/commands.setCall';

module.exports = {
    name: 'setcanal',
    description: 'Modifica permissões de usuários',
    booster: true,
    usage: '<transmitir/conectar/convidar/ver> <on/off> @user',
    execute
}

function execute(this: { name: string }, message: Message, args: string[], client: Client, config: IConfig) {
    const permissionsAccepted = {
        'ver': 'VIEW_CHANNEL',
        'conectar': 'CONNECT',
        'convidar': 'CREATE_INSTANT_INVITE',
        'transmitir': 'STREAM'
    }
    const moderator = '748601213079126027'
    
    const [ userPermission, keymode ] = args;

    console.log(config)
    
    if(!userPermission) return message.reply(embed.help(config.prefix, this.name, message.client.user?.id))
    
    const voiceChannel = getBoosterCall();
    if(!voiceChannel) return message.channel.send(embed.notCreatedChannel);

    const boolean = keymode === 'on' ? true : false;

    if(userPermission === 'fechar' || userPermission === 'excluir') return function() {
        !voiceChannel.deleted && voiceChannel.delete();
        db.get('boostersThatCreatedCalls').remove({ channelId: voiceChannel.id }).write();
    }()

    if(userPermission !== 'ver' && userPermission !== 'conectar' && userPermission !== 'convidar' && userPermission !== 'transmitir') return message.channel.send(embed.invalidOptions(Object.keys(permissionsAccepted)));
    const permission = permissionsAccepted[userPermission]

    const taggedUser = message.mentions.users.first();
    if(!taggedUser) return

    const user = message.guild?.members.cache.get(taggedUser.id);
    if(user?.roles.cache.has(moderator)) return embed.isModerator

    voiceChannel.updateOverwrite(taggedUser.id, {
        [permission]: boolean === true,
    }).then(() => {
        message.channel.send(embed.sucessMessage(taggedUser.id, permission, boolean));
    })


    /* Functions */
    function getBoosterCall() {
        const user = db.get('boostersThatCreatedCalls').find({ userId: message.author.id }).value();

        const call = message.guild?.channels.cache.get(user?.channelId);

        return call?.type === 'voice' ? call : undefined;
    }
}