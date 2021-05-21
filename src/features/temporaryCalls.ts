import { Channel, Client, Guild, GuildMember, Message, MessageReaction, PartialUser, User, VoiceChannel } from "discord.js";
import { IConfig } from "..";
import database from '../database';

const db: any = database; // error in types of lowdb

module.exports = {
    name: 'Temporary Calls',
    description: 'Cria um canal de voz que quando ninguém está usando, ela é excluida.',
    execute
}

async function execute(client: Client, config: IConfig) {
    const guild = client.guilds.cache.get(config.guild);

    removeOldReactions(guild, config);
    removeEmptyCalls(guild);

    const controllerMessage = (type: 'normal' | 'games') => {
        const channel = guild?.channels.cache.get(config.temporaryCalls[type].controllerChannel);

        return channel?.isText() && channel.messages.cache.first()?.id;
    }

    client.on('messageReactionAdd', async (data, user) => {
        if(data.partial) await data.fetch();
        if(data.message.id !== controllerMessage('games') && data.message.id !== controllerMessage('normal')) return;

        removeReaction(data.message.channel.id, client, user, data);
        
        const categoriesAccepted = {
            '🔮': 'LoL', '🛸': 'Among Us', '🔪': 'Brawlhala', '🏹': 'Genshin', '👹': 'Erebus/RPG',
            '🔫': 'CoD', '🧊': 'Minecraft', '💣': 'Valorant', '🚓': 'GTA', '🚗': 'Rocket League', 
            '⚽': 'Esportes','♟': 'Xadrez/Damas', '❓': 'Outros', '🎇': 'Bordel Vip', '🔹': 'Call Boosters',
            '🔒': 'Privado', '🎧': 'Call Comum'
        };

        const userInDatabase: IUserDb = db.get('usersThatCreatedCalls').find({ userId: user.id }).value();
        const category = Object.entries(categoriesAccepted).find(category => category[0] === data.emoji.name);
        
        !userInDatabase && !!category && function([emoji, name]) {
            if(!guild) return;

            !userAlreadyOnCall(guild, user.id) && createChannel(`彡${emoji}┇ ${name}`, user.id, user.id, guild)
                .then(async channel => {
                    name === 'Bordel Vip' 
                        && await setSettings(channel, config.temporaryCalls.games.category, "vip", client, config);    

                    name === 'Call Boosters' 
                        && await setSettings(channel, config.temporaryCalls.games.category, "booster", client, config);

                    name !== 'Bordel Vip' && name !== 'Call Boosters' 
                        && await setSettings(channel, config.temporaryCalls.games.category, "basic", client, config);
    
                    await waitForUsersToJoin(channel, user.id, guild);
                })
                .catch(err => console.error(err));
        }(category);
    });
};


/* Functions */
async function removeOldReactions(guild: Guild | undefined, config: any) { // not connected to controllerMessageNormal
    if(!guild) return

    const controllerMessageGames = await async function() {
        const channel = guild.channels.cache.get(config.temporaryCalls.games.controllerChannel);

        return channel?.isText() ? (await channel.messages.fetch({ limit: 1 })).first() : undefined
    }();

    const reactions = controllerMessageGames?.reactions

    reactions?.cache.forEach(async reaction => (await reaction.users.fetch()).forEach(user => {
        if(user.id === guild.me?.id) return;
        controllerMessageGames?.reactions.cache.find(r => r.emoji.name === reaction.emoji.name)?.users.remove(user.id);
    }));
}
function removeEmptyCalls(guild: Guild | undefined) {
    if(!guild) return

    const usersDB: IUserDb[] = db.get('usersThatCreatedCalls').value();
    const usersDB2: IUserDb[] = db.get('boostersThatCreatedCalls').value();

    usersDB.forEach(user => {
        if(!user) return;

        const findChannel = (id: string) => guild.channels.cache.find(channel => channel.id === id);

        const dbChannel = db.get('usersThatCreatedCalls').find({ channelId: findChannel(user?.channelId)?.id }).value();

        !!dbChannel && findChannel(user?.channelId)?.members.size === 0 
            && db.get('usersThatCreatedCalls').remove({ channelId: findChannel(user?.channelId)?.id }).write();
            
        findChannel(user?.channelId)?.members.size === 0 && findChannel(user?.channelId)?.delete();
    });
    usersDB2.forEach(user => {
        if(!user) return;

        const findChannel = (id: string) => guild.channels.cache.find(channel => channel.id === id);
        
        const dbChannel = db.get('boostersThatCreatedCalls').find({ channelId: findChannel(user?.channelId)?.id }).value();

        !!dbChannel && findChannel(user?.channelId)?.members.size === 0 
            && db.get('boostersThatCreatedCalls').remove({ channelId: findChannel(user?.channelId)?.id }).write();
            
        findChannel(user?.channelId)?.members.size === 0 && findChannel(user?.channelId)?.delete();
    });
}
function userAlreadyOnCall(guild: Guild, memberId: string) {
    const member = guild.members.cache.get(memberId);
    if(!member) return;

    return !!member.voice.channel;
};
async function removeReaction(channelId: any, client: Client, user: User | PartialUser, data: MessageReaction) {
    const channel = client.channels.cache.get(channelId); // Type error

    if(!channel?.isText()) return

    channel?.messages.fetch().then((channelMessages) => {
        const message = channelMessages.first();
        const reaction = message?.reactions.cache.find(reaction => !!reaction.count && reaction.count > 1);

        reaction?.users.remove(user.id);
    });
};
function createChannel(channelName: string, userId: string, channelId: string, guild: Guild) {
    return new Promise<VoiceChannel>(async (resolve, reject) => {
        !!guild && guild.channels.create(channelName, { type: 'voice' })
            .then(channel => {
                db.get('usersThatCreatedCalls').push({ userId: userId, channelId: channel.id }).write();
                resolve(channel);
            })
            .catch(err => reject(err));
    });
};
async function setSettings(channel: VoiceChannel, category: string, type: 'basic' | 'booster' | 'vip', client: Client, config: any) {
    channel.setParent(category);

    const everyone = client.guilds.cache.get(config.guildId)?.roles.everyone.id; 
    if(!everyone) return;

    type === 'basic' && await channel.overwritePermissions([
        {
            id: everyone,
            allow: ['CONNECT', 'VIEW_CHANNEL']
        },
    ]);
    type === 'booster' && await channel.overwritePermissions([
        {
            id: everyone,
            deny: ['CONNECT']
        },
        {
            id: config.temporaryCalls.roles.booster,
            allow: ['CONNECT']
        }
    ]);
    type === 'vip' && await channel.overwritePermissions([
        {
            id: everyone,
            deny: ['CONNECT']
        },
        {
            id: config.temporaryCalls.roles.vip,
            allow: ['CONNECT']
        }
    ]);
};
async function waitForUsersToJoin(channel: VoiceChannel | undefined, userId: string, guild: any, lol: boolean = false) {
    if(channel === undefined) return;

    return new Promise<void | { id: string, delete: () => void }>(terminated => setTimeout(async () => {
        const usersInCall: GuildMember[] = [];
        await guild.channels.cache.get(channel.id).members.forEach((member: GuildMember) => {
            usersInCall.push(member);
        });

        lol === true && easterEgg(usersInCall, channel);
        
        if(usersInCall.length < 1) {
            !channel.deleted && channel.delete();
            db.get('usersThatCreatedCalls').remove({ userId: userId }).write();

            terminated();
        } else terminated(channel);
    }, 1000 * 15));
}
async function easterEgg(users: GuildMember[], channel: VoiceChannel) {
    const findLoLSuperUser = new Promise<void>((resolve, reject) => {
        users.forEach(user => user.roles.cache.has('748437789250682911') && resolve());

        reject();
    });

    try {
        await findLoLSuperUser;
        return await channel.setName('★🔮┇ LoL 𝓈𝓊𝓅𝑒𝓇');
    } catch {
        return await channel.setName('彡🔮┇ LoL');
    } // i think this is not working... But ok.
}


/* Types */
type IUserDb = { userId: string, channelId: string } | undefined