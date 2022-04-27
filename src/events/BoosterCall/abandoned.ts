import Discord from 'discord.js';
import { createEvent } from "../../handlers/events";
import { deleteChannelIfUsersDontJoin } from '.';
import errors from '../../errors';

export default createEvent({
    active: true,
    name: 'Canal Booster existentes',
    description: 'Remove canais boosters que ficam vazios depois de serem usados',
    type: 'voiceStateUpdate',
    async execute(_, oldState, newState) {
        const BOOSTER_CALL_CHARACTER = process.env.BOOSTER_CALL_CHARACTER;
        if(!BOOSTER_CALL_CHARACTER) return errors.envNotFound('BOOSTER_CALL_CHARACTER');
        
        if(!oldState.channel?.name.startsWith(BOOSTER_CALL_CHARACTER)) return;

        const AllFetchedChannels = await newState.guild.channels.fetch();
        const channel = AllFetchedChannels.get(oldState.channel?.id);

        if(!channel || !channel.isVoice()) return;
        
        deleteChannelIfUsersDontJoin(channel as Discord.VoiceChannel)
    }
})