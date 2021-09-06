import { Message, TextChannel } from "discord.js";
import db from "../database";
import { IFeature } from "../handlers/features";

import embed from '../embeds/features.trends'

const trends: IFeature = {
    active: true,
    name: 'trends',
    description: 'Pega as mensagens mais enviadas dos membros e armazena em uma mensagem',
    async execute(client, config, guild) {
        let actionsCache = 0;
        const trendChannel = <TextChannel>guild.channels.cache.get(config.channels.trend);

        let trendMessage = await fetchTrendMessage(trendChannel);
        if(!trendMessage) trendMessage = await createTrendMessage(trendChannel, getBestHashtags());

        client.on('messageCreate', message => {
            if(!config.channels.talk.includes(message.channel.id)) return;

            const hashtag: `#${string}` | undefined = message.content
                .split(' ')    
                .find(element => element.includes('#')) as `#${string}`; 

            if(!hashtag) return;

            const valueInDatabase = findInDatabase(hashtag);
            if(valueInDatabase) pushToDatabase(hashtag, valueInDatabase);
            else pushToDatabase(hashtag);

            actionsCache++;
        });

        setInterval(() => 
            actionsCache > 0 
            && editTrendMessage(trendMessage, getBestHashtags()) 
            && (actionsCache = 0), 
        1000 * 5);
    }
}

module.exports = trends;


/* Functions */
function pushToDatabase(hashtag: `#${string}`, oldValue?: number) {
    if(oldValue) {
        db.set(`hashtags.${hashtag.replace('#', '')}`, ++oldValue).write();
    } else {
        db.set(`hashtags.${hashtag.replace('#', '')}`, 1).write();
    }
}
function findInDatabase(hashtag: `#${string}`): number {
    return db.get(`hashtags.${hashtag.replace('#', '')}`).value();
}
async function fetchTrendMessage(channel: TextChannel) {
    const allMessagesOfChannel = await channel.messages.fetch();

    if(allMessagesOfChannel.size !== 1) return;

    const message = allMessagesOfChannel.first();

    return message;
}
async function createTrendMessage(channel: TextChannel, hashtags: fixedSizeArray) {
    try {
        channel.bulkDelete(100)
    } catch {}

    return channel.send({ embeds: [embed.trendMessage(hashtags)] });
}
async function editTrendMessage(message: Message | undefined, hashtags: fixedSizeArray) {
    if(!message) return;

    return message.edit({ embeds: [embed.trendMessage(hashtags)] });
}

export type fixedSizeArray = readonly [
    (string | undefined)?, 
    (string | undefined)?, 
    (string | undefined)?, 
    (string | undefined)?, 
    (string | undefined)?, 
    (string | undefined)?, 
    (string | undefined)?, 
    (string | undefined)?, 
    (string | undefined)?, 
    (string | undefined)?
];
function getBestHashtags(): fixedSizeArray {
    const allHashtags: { [key: string]: number } = db.get('hashtags').value();

    const top10Hashtags = (() => {
        const mostUsedHashtagsFirst: any = Object.keys(allHashtags)
            .sort((a: string, b: string) => allHashtags[b] - allHashtags[a]);

        const the10Hashtags = <fixedSizeArray>mostUsedHashtagsFirst.slice(0, 10);

        return the10Hashtags
    })();

    return top10Hashtags;
}