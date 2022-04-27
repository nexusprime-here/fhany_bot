import Discord from 'discord.js';
import cache from '../../database/cache';

import errors from "../../errors";
import Abandoned from "./abandoned";
import news from "./news";

export const BOOSTER_CALL_TIMEOUT = <number>function() {
    const envVar = process.env.BOOSTER_CALL_TIMEOUT;

    if(!envVar) errors.envNotFound("BOOSTER_CALL_TIMEOUT");
    else return parseInt(envVar);
}();

export async function deleteChannelIfUsersDontJoin(channel: Discord.VoiceChannel) {
    let timeOut = false;
    setTimeout(() => timeOut = true, BOOSTER_CALL_TIMEOUT);

    while(true) {
        if((await channel.fetch()).members.size > 0) break;
        if(!timeOut) continue;

        await channel.delete();
        await deleteDataFromDatabase(channel);

        break;
    }

    async function deleteDataFromDatabase(channel: Discord.VoiceChannel) {
        await cache.read();
        const indexOfChannelInDatabase = cache.data.boosterCalls.findIndex(call => call.channelId === channel.id);
        cache.data.boosterCalls.splice(indexOfChannelInDatabase, 1);
        await cache.write();
    }
}

export default [
    Abandoned,
    news
]