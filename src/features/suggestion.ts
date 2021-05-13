import { Client, Message, User, PartialUser, MessageEmbed } from "discord.js";
import { IConfig } from "..";
import database from "../database";
import embed from "../embeds/features.suggestion";

const db: any = database;

module.exports = {
    name: "Suggetion", 
    description: "Um sistema que separa as mensagens mais curtidas das menos curtidas", 
    execute
}

function execute(client: Client, config: IConfig) {
    const channel = client.channels.cache.get(config.suggestion.channel);

    const suggestionsCache: ISuggestionMessage[] = db.get('suggestionsCache').value();

    channel?.type === 'text' && deleteAllOldMessages(channel);
    reloadSuggestions();

    let actionsCache: number = 0;
    
    client.on('message', async message => {
        if(message.channel.id !== config.suggestion.channel) return;
        if(message.author.bot) return;
        if(message.content.startsWith(config.prefix) && message.author.id) return;

        actionsCache++;

        saveSuggestionInSuggestionsCache(message);
        await deleteCommandMessage(message);

        alertUser('message', message);
    });

    client.on('messageReactionAdd', async (data, user) => {
        if(data.message.channel.id !== config.suggestion.channel) return;
        if(user.bot) return;

        actionsCache++;

        const findMessage = suggestionsCache.find(message => message.id === data.message.embeds[0].footer?.text);

        if(await userAlreadyRated(user, findMessage?.id)) {
            return removeReaction(data.emoji.name, data.message.channel.id, data.message.id, user.id);
        }

        if(!findMessage?.id) return;

        if(data.emoji.name === '👍') setRate('+', findMessage.id, user.id);
        else if(data.emoji.name === '👎') setRate('-', findMessage.id, user.id);

        alertUser('reaction', data.message);
    });

    setInterval(() => actionsCache > 0 && reloadSuggestions(), 1000 * 60 * 30);
    setDaysTimeout(() => db.get('suggestionsCache').remove({}).write(), 7); 


    /* Functions */
    function setDaysTimeout(callback: () => any, days: number) {
        // 86400 seconds in a day
        let msInDay = 86400*1000; 
    
        let dayCount = 0;
        let timer = setInterval(function(this: () => NodeJS.Timeout) {
            dayCount++;  // a day has passed
    
            if (dayCount === days) {
               clearInterval(timer);
               callback.apply(this, []);
            }
        }, msInDay);
    }
    async function alertUser(type: 'message' | 'reaction', message: Message) {
        if(type === 'message') {
            const thisMessage = await message.channel.send(`<@${message.author.id}>`, embed.messageSent(message.author.id));
            setTimeout(() => thisMessage.delete(), 7000)
        } else if(type === 'reaction') {
            const alert = new MessageEmbed()
                .setAuthor(message.embeds[0].author?.name, message.embeds[0].author?.iconURL || undefined)
                .setDescription('**✅ Avaliação Enviada!**\n\n' + message.embeds[0].description)
                .setFooter(message.embeds[0].footer?.text)
                .setColor('#F55EB3')
                .addFields(message.embeds[0].fields)

            const normal = new MessageEmbed()
                .setAuthor(message.embeds[0].author?.name, message.embeds[0].author?.iconURL || undefined)
                .setDescription(message.embeds[0].description)
                .setFooter(message.embeds[0].footer?.text)
                .setColor('#F55EB3')
                .addFields(message.embeds[0].fields)
        
            await message.edit(alert)
            setTimeout(() => message.edit(normal), 5000);
        };
    };
    async function reloadSuggestions() {
        if(suggestionsCache.length < 1) return;

        const reorganizedSuggestions = suggestionsCache.sort((a, b) => {
            let result = a.likes.length - a.dislikes.length;
            let result2 = b.likes.length - b.dislikes.length;

            if(result > result2) return 1
            else if(result < result2) return -1
            else return 0
        });

        const channel = client.guilds.cache.get(config.guild)?.channels.cache.get(config.suggestion.channel); // type bug ;-;
        if(!channel?.isText()) return;

        const allMessages = await channel.messages.fetch({ limit: 100 });
        channel.bulkDelete(allMessages);

        const embed = (suggestion: ISuggestionMessage) => new MessageEmbed()
            .setAuthor(suggestion.author.username, suggestion.icon || undefined)
            .setDescription(suggestion.content)
            .setFooter(suggestion.id)
            .setColor(suggestion.accept ? '#00FF00' : '#F55EB3')
            .addFields([
                {
                    name: 'ㅤ', // invisible keys, this isn't spaces
                    value: `👍: ${suggestion.likes.length}`,
                    inline: true
                },
                {
                    name: 'ㅤ',
                    value: `👎: ${suggestion.dislikes.length}`,
                    inline: true
                }
            ]);

        reorganizedSuggestions.forEach(async suggestion => {
            const msg = await channel.send(embed(suggestion));
            !!msg && await msg.react('👍') && await msg.react('👎');
        });

        actionsCache = 0; // clean cache
    }
    async function deleteAllOldMessages(channel: any) {
        let fetched = await channel.messages.fetch({ limit: 100 });
        channel.bulkDelete(fetched);
    }
    function removeReaction(emoji: string, channelId: any, messageId: string, userId: string) {
        const channel: any = client.channels.cache.get(channelId)

        channel.messages.fetch(messageId).then((reactionMessage: any) => {
            reactionMessage.reactions.resolve(emoji).users.remove(userId);
        });
    }
    function setRate(rate: '+' | '-', suggestionId: string, userId: string) {
        const suggestion = db.get('suggestionsCache').find({ id: suggestionId })

        rate === '+' && suggestion.get('likes').push(userId).write();
        rate === '-' && suggestion.get('dislikes').push(userId).write();
    }
    function userAlreadyRated(user: User | PartialUser, id: string | undefined) {
        if(!id) return;

        return new Promise<boolean>(terminated => {
            suggestionsCache.forEach(suggestion => {
                if(suggestion.id !== id) return;

                suggestion.likes.includes(user.id) && terminated(true);
                suggestion.dislikes.includes(user.id) && terminated(true);
            });

            terminated(false);
        });
    }
    function saveSuggestionInSuggestionsCache(suggestionMessage: Message) {
        if(!suggestionMessage.member) return;

        db.get('suggestionsCache').push({
            icon: suggestionMessage.author.avatarURL(),
            content: suggestionMessage.content,
            id: suggestionMessage.id,
            author: {
                username: suggestionMessage.member.user.username,
                id: suggestionMessage.member.user.id
            },
            accept: false,
            likes: [],
            dislikes: []
        }).write();
    }
    async function deleteCommandMessage(message: Message) {
        return await message.delete();
    }
}


/* Types */
export interface ISuggestionMessage {
    icon: string | null;
    content: string;
    id: string;
    author: {
        username: string,
        id: string
    }
    accept: boolean;
    likes: string[];
    dislikes: string[];
}