import { GuildMember, VoiceChannel, VoiceState } from 'discord.js';
import db from '../database';
import { IEvent } from "../handlers/events";

const voiceChannel: IEvent = {
    active: true,
    name: 'Canais de Voz',
    description: 'Remove canais de voz temporários vazios',
    type: 'voiceStateUpdate',
    async execute(config, oldState: VoiceState, newState: VoiceState) {
        const acceptedSymbols = ['彡', '★', '❖'];
        if(!oldState.channel || !acceptedSymbols.includes(oldState.channel.name[0])) return;
        if(!newState.guild) return;

        const channel = <VoiceChannel | undefined>await newState.guild.channels.fetch(oldState.channel.id);
        
        if(!channel || channel.deleted) return;

        if(channel.members.size === 0) {
            channel.delete();
            
            db.get(oldState.channel.name[0] !== '❖' ? 'usersThatCreatedCalls' : 'boostersThatCreatedCalls')
                .remove({ userId: oldState.member?.id })
                .write();
        } else if(channel.members.size > 0 && channel.name[0] === '彡') {
            const randomUser = <GuildMember>channel.members.first();
            db.get('usersThatCreatedCalls').find({ channelId: channel.id }).assign({ userId: randomUser.id }).write();
        }
    }
}

module.exports = voiceChannel;