import { Client, VoiceState } from "discord.js";
import db from '../database';

module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState: VoiceState, newState: VoiceState, client: Client) {
        if(newState.channelID !== null) return;
        if(!oldState.channel) return;

        const acceptedSymbols = ['彡', '★', '❖'];
        
        if(acceptedSymbols.includes(oldState.channel.name[0])) {
            if(!newState.guild) return;

            if(!oldState.channel) return;
            const channel = newState.guild.channels.cache.get(oldState.channel.id)
            
            if(channel?.members.size === 0) {
                !channel.deleted && channel.delete();

                db.get(oldState.channel.name[0] !== '❖' ? 'usersThatCreatedCalls' : 'boostersThatCreatedCalls')
                    .remove({ userId: oldState.member?.id })
                    .write();
            };
        }
    }
}