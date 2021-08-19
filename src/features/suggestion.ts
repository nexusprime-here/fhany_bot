import { 
    Client, Message, User, MessageActionRow, MessageButton, TextChannel, DMChannel, NewsChannel
} from "discord.js";
import { IConfig } from "..";
import db from "../database";

import embed from "../embeds/features.suggestion";
import { IFeature } from "../handlers/features";

const suggestion: IFeature = {
    active: true,
    name: "suggestion", 
    description: "Um sistema que separa as mensagens mais curtidas das menos curtidas", 
    execute(client: Client, config: IConfig) {
        const suggestionChannel = <TextChannel>client.channels.cache.get(config.channels.suggestion);
    
        const suggestionsCache: ISuggestionMessage[] = db.get('suggestionsCache').value();
        let actionsCache: number = 0;
    
        deleteAllOldMessages(suggestionChannel);
        reloadSuggestions(suggestionsCache, suggestionChannel, actionsCache);
    
        client.on('messageCreate', async message => {
            if(message.channel.id !== config.channels.suggestion) return;
            if(message.author.bot) return;
    
            actionsCache++;
    
            saveMessageInSuggestionsCache(message);
            await deleteCommandMessage(message);
        });
        
        client.on('interactionCreate', async interaction => {
            if (!interaction.isButton()) return;
            if(interaction.channel?.id !== config.channels.suggestion) return;
            if(interaction.member?.user.bot) return;
    
            actionsCache++;
    
            const findMessage = suggestionsCache.find(message => message.id === interaction.message.embeds[0].footer?.text);
    
            if(await userAlreadyRated(interaction.user, findMessage?.id, suggestionsCache)) 
                return interaction.reply({ embeds: [embed.alreadyRated], ephemeral: true });
    
            if(!findMessage?.id) return;
    
            if(interaction.customId === 'like') setRate('+', findMessage.id, interaction.user.id);
            else if(interaction.customId === 'dislike') setRate('-', findMessage.id, interaction.user.id);
            else return;
    
            interaction.reply({ embeds: [embed.success], ephemeral: true });
        })
    
        setInterval(() => actionsCache > 0 && reloadSuggestions(suggestionsCache, suggestionChannel, actionsCache), 1000 * 60 * 10);
    
        const date = new Date();
        if(date.getHours() === 0) {
            updateTimeRemainingOfSuggestions(suggestionsCache);
            deleteSuggestionsWithoutTimeRemaining(suggestionsCache);
        }
    }
}

module.exports = suggestion;


/* Functions */
function deleteSuggestionsWithoutTimeRemaining(cache: ISuggestionMessage[]) {
    db.get('suggestionsCache').remove({ daysRemaining: 0 }).write();
}
function updateTimeRemainingOfSuggestions(suggestionsCache: ISuggestionMessage[]) {
    suggestionsCache.forEach(suggestion => {
        const thisSuggestion = db.get('suggestionsCache').find({ id: suggestion.id });
        thisSuggestion.assign({ daysRemaining: thisSuggestion.value().daysRemaining - 1 }).write();
    });
}
function saveMessageInSuggestionsCache(suggestionMessage: Message) {
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
        dislikes: [],
        daysRemaining: 7
    }).write();
}
async function deleteCommandMessage(message: Message) {
    return await message.delete();
}
function setRate(rate: '+' | '-', suggestionId: string, userId: string) {
    console.log(`foi`)
    const suggestion = db.get('suggestionsCache').find({ id: suggestionId })

    rate === '+' && suggestion.get('likes').push(userId).write();
    rate === '-' && suggestion.get('dislikes').push(userId).write();
}
function userAlreadyRated(user: User, id: string | undefined, cache: ISuggestionMessage[]) {
    if(!id || !user) return;

    return new Promise<boolean>(terminated => {
        cache.forEach(suggestion => {
            if(suggestion.id !== id) return;

            suggestion.likes.includes(user.id) && terminated(true);
            suggestion.dislikes.includes(user.id) && terminated(true);
        });

        terminated(false);
    });
}
async function deleteAllOldMessages(channel: TextChannel | undefined) {
    if(!channel) return;
    let fetched = await channel.messages.fetch();
    channel.bulkDelete(fetched);
}

async function reloadSuggestions(cache: ISuggestionMessage[], channel: TextChannel | DMChannel | NewsChannel, actionsCache: number) {
    if(cache.length < 1) return;
    if(channel.type !== 'GUILD_TEXT') return;

    const reorganizedSuggestions = cache.sort((a, b) => {
        let result = a.likes.length - a.dislikes.length;
        let result2 = b.likes.length - b.dislikes.length;

        if(result > result2) return 1
        else if(result < result2) return -1
        else return 0
    });

    const allOldMessages = await channel.messages.fetch({ limit: 100 });
    channel.bulkDelete(allOldMessages);

    const row = new MessageActionRow().addComponents(
        new MessageButton()
            .setEmoji('👍')
            .setStyle("SUCCESS")
            .setCustomId('like'),
            
        new MessageButton()
            .setEmoji('👎')
            .setStyle("DANGER")
            .setCustomId('dislike')
    );

    reorganizedSuggestions.forEach(suggestion => {
        const messageObject = { embeds: [embed.suggestion(suggestion)] }

        if(!suggestion.accept) Object.assign(messageObject, { components: [row] });

        channel.send(messageObject);
    });

    actionsCache = 0;
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
    daysRemaining: number;
}