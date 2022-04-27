import Discord from 'discord.js';
import { ifNotExistsChannelThrowError } from '.';
import { Embed } from '../../main';
import cache from '../../database/cache';
import { ISubCommand } from "../../handlers/commands";

const subCommand: ISubCommand = async (interaction, voiceChannelOfUser: Discord.VoiceChannel) => {
    if(!ifNotExistsChannelThrowError(voiceChannelOfUser, interaction)) return;
        
    await voiceChannelOfUser.delete();
    
    const indexOfCallInDatabase = cache.data.boosterCalls.findIndex(call => call.channelId === voiceChannelOfUser.id);
    cache.data.boosterCalls.splice(indexOfCallInDatabase, 1);
    await cache.write();
    
    interaction.reply(Embed.create('Sucesso', 'Canal apagado'));
}

export default subCommand;