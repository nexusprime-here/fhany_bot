import Discord from 'discord.js';
import { deleteChannelIfUsersDontJoin } from '.';
import errors from '../../errors';
import { createEvent } from "../../handlers/events";

export default createEvent({
    active: true,
    name: 'Novo Canal Booster',
    description: 'Observa os canais boosters recentemente criados, e deleta se não entrar nenhum membro',
    type: 'channelCreate',
    async execute(_, channel) {
        const BOOSTER_CALL_CHARACTER = process.env.BOOSTER_CALL_CHARACTER;
        if(!BOOSTER_CALL_CHARACTER) return errors.envNotFound('BOOSTER_CALL_CHARACTER');

        if(channel.type !== 'GUILD_VOICE' && !channel.name.startsWith(BOOSTER_CALL_CHARACTER)) return;
        
        deleteChannelIfUsersDontJoin(channel as Discord.VoiceChannel);
    }
})