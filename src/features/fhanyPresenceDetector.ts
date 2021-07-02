import { Client, Guild, GuildMember, Message, User } from "discord.js";
import { IConfig } from "..";

import embed from '../embeds/features.fhanyPresenceDetector';

module.exports = { 
    name: "Fhany Presence Detector",
    description: "Detecta a Fhany no chat e avisa para os usuários, se a Fhany não estiver ativa no chat os usuários não podem mencionar.",
    execute
}

function execute(client: Client, config: IConfig) {
    const fhanyActiveCache: number[] = []; // I used Array from detect if the Fhany is inactive more easy, if an array is empty, she is inactive
    const wrongMentionsCache: GuildMember[] = [];
    
    client.on('message', async message => {
        if(message.author.bot) return
        if(config.fhanyPresenceDetector.whiteListChannels.includes(message.channel.id)) return;
        if(message.author.id === config.fhanyPresenceDetector.fhany) {
            if(config.fhanyPresenceDetector.blackListChannels.includes(message.channel.id)) return;
            const fetchChannel = client.channels.cache.get(message.channel.id);
            
            const count = getLastNumber();
            fhanyActiveCache.length === 0 && warnAllUsersOfFhanyOn(fetchChannel);
            
            cleanOldCache();
            
            await pushNewCache(count);
            await cleanCacheIn(1000 * 60, count);
            
            fhanyActiveCache.length === 0 && warnAllUsersOfFhanyOff(fetchChannel);
        } else {
            if(!await mentionTheFhany(message)) return;
            if(await isStaffer()) return;
            if(config.fhanyPresenceDetector.blackListChannels.includes(message.channel.id)) return deleteUserMessage(message, true);
            
            fhanyActiveCache.length === 0 && deleteUserMessage(message);
        }
        
    
        /* Functions */
        function isStaffer() {
            const member = message.guild?.members.cache.get(message.author.id);

            return new Promise<boolean>(terminated => {
                member?.roles.cache.forEach(role => {
                    config.staffers.includes(role.id) && terminated(true);
                });

                terminated(false);
            });
        }
        function mentionTheFhany(message: Message) {
            return new Promise<boolean>((terminated) => {
                const fhany = client.guilds.cache.get(config.guild)?.members.cache.get(config.fhanyPresenceDetector.fhany);
                if(!fhany) return;
                
                fhany.roles.cache.forEach(role => {
                    message.mentions.users.has(config.fhanyPresenceDetector.fhany) && terminated(true);
                    message.mentions.roles.has(role.id) && terminated(true);
                });
                terminated(false)
            });
        };
        function deleteUserMessage(message: Message, isBlackList?: boolean) {
            searchUserInCache(message.author).length === 0 
                && message.reply(isBlackList 
                    ? embed.mentionFhanyNotPermittedAlternative(message)
                    : embed.mentionFhanyNotPermitted1(message)
                );
        
            searchUserInCache(message.author).length === 1
                && message.reply(embed.mentionFhanyNotPermitted2(message));
        
            searchUserInCache(message.author).length === 2
                && addSilenceRole(searchUserInCache(message.author)[0])
                && message.reply(embed.mentionFhanyNotPermitted3(message))
                && removeSilenceRole(searchUserInCache(message.author)[0]);
        
            message.delete();
        
            const guild = client.guilds.cache.get(config.guild);
            const user = guild?.members.cache.get(message.author.id);
        
            !!user && wrongMentionsCache.push(user);
            setTimeout(deleteMentionCache, 1000 * 60 * 30);


            function addSilenceRole(member: GuildMember) {
                member.roles.add(config.fhanyPresenceDetector.roles.silence)
                
                return true
            }
            function removeSilenceRole(member: GuildMember) {
                setTimeout(() => {
                    member.roles.remove(config.fhanyPresenceDetector.roles.silence);
                }, 1000 * 60 * 60 * 1);
            }
            function deleteMentionCache() {
                wrongMentionsCache.forEach((user, index) => {
                    user.id === message.author.id && wrongMentionsCache.splice(index, 1);
                });
            }
            function searchUserInCache(user: User) {
                return wrongMentionsCache.filter(member => member.id === user.id);
            }
        };
    });
    
    client.on('typingStart', async (channel, user) => {
        if(config.fhanyPresenceDetector.blackListChannels.includes(channel.id)) return;
        if(config.fhanyPresenceDetector.whiteListChannels.includes(channel.id)) return;
        if(user.id !== config.fhanyPresenceDetector.fhany) return;

        const fetchChannel = client.channels.cache.get(channel.id);
        const count = getLastNumber();
        fhanyActiveCache.length === 0 && warnAllUsersOfFhanyOn(fetchChannel);


        cleanOldCache();
        
        await pushNewCache(count);
        await cleanCacheIn(1000 * 60, count);
        fhanyActiveCache.length === 0 && warnAllUsersOfFhanyOff(fetchChannel);
    });


    /* Global Functions */
    function warnAllUsersOfFhanyOff(channel: any) {
        channel.send(embed.fhanyLeftTheChat)
            // .then((msg: Message) => setTimeout(() => msg.delete(), 1000 * 25));
    };
    function warnAllUsersOfFhanyOn(channel: any) {
        channel.send(embed.fhanyIsActiveInChat)
            // .then((msg: Message) => setTimeout(() => msg.delete(), 1000 * 25));
    };
    function getLastNumber(): number {
        if(fhanyActiveCache.length === 0) {
            return 1;
        } else {
            const count = fhanyActiveCache[0]++; // I don't know why, but the code only worked if there was this line
            return fhanyActiveCache[0]++;
        };
    };
    function cleanCacheIn(timeOut: number, id: number) {
        return new Promise<void>(terminated => setTimeout(() => {
            const index = fhanyActiveCache.indexOf(id);
            if(index < 0) return terminated();

            fhanyActiveCache.splice(index, 1);
            terminated();
        }, timeOut));
    };
    async function pushNewCache(numberOfOrder: number) {
        fhanyActiveCache.push(numberOfOrder);
    };
    function cleanOldCache() {
        fhanyActiveCache.length = 0;
    };
}
