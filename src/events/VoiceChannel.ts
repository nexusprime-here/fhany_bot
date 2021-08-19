import db from '../database';
import { IEvent } from "../handlers/events";

const voiceChannel: IEvent = {
    active: true,
    name: 'Canais de Voz',
    description: 'Remove canais de voz temporários vazios',
    type: 'voiceStateUpdate',
    execute(config, oldState, newState) {
        const acceptedSymbols = ['彡', '★', '❖'];
        if(!oldState.channel || !acceptedSymbols.includes(oldState.channel.name[0])) return;
        
        if(!newState.guild || !oldState.channel) return;
        const channel = newState.guild.channels.cache.get(oldState.channel.id);
        
        if(channel && !channel.isThread() && channel.members.size === 0) {
            !channel.deleted && channel.delete();
        
            db.get(oldState.channel.name[0] !== '❖' ? 'usersThatCreatedCalls' : 'boostersThatCreatedCalls')
                .remove({ userId: oldState.member?.id })
                .write();
        }
    }
}

module.exports = voiceChannel;