import { Channel, Client, Guild, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed, MessageReaction, MessageSelectMenu, MessageSelectOptionData, NewsChannel, PartialUser, SelectMenuInteraction, TextChannel, User, VoiceChannel } from "discord.js";
import { IConfig } from "..";
import database from '../database';

import embed from '../embeds/features.temporaryCalls'

const db: any = database; // error in types of lowdb

module.exports = {
    name: 'Temporary Calls',
    description: 'Cria um canal de voz que quando ninguém está usando, ela é excluida.',
    execute
}

async function execute(client: Client, config: IConfig) {
    const guild = client.guilds.cache.find(guild => guild.id === config.guild);
    const controllerChannel = guild?.channels.cache.find(channel => channel.id === config.temporaryCalls.controllerChannel);

    // removeEmptyCalls(guild);

    if(!controllerChannel || controllerChannel.isThread() || !controllerChannel.isText()) return;

    const acceptedCategories = {
        '🛸┇ Arcade': 'Feitos para máquinas de arcade.', 
        '🍄┇ Plataforma': 'Personagens se move horizontalmente.', 
        '⚽┇ Esporte': 'Simulam a prática de esportes.', 
        '🚗┇ Corrida': 'Competição de corrida usando veículos.', 
        '👹┇ RPG': 'São jogos que se assimilam aos RPGs de mesa.', 
        '♟┇ Estratégia': 'Enfatiza habilidade de planejamento para ganhar.', 
        '⚔┇ Aventura': 'O jogador vive uma história com exploração.', 
        '🔫┇ FPS/TPS': 'O Objetivo é acertar alvos com armas de Fogo.'
    }

    let controllerMessage = await fetchControllerMessage(controllerChannel);
    if(!controllerMessage) controllerMessage = await createControllerMessage(controllerChannel, acceptedCategories);

    client.on('interactionCreate', async interaction => {
        if (!interaction.isSelectMenu() || interaction.customId !== 'controllerMenu') return;
        
        const userInDatabase: IUserDb = db.get('usersThatCreatedCalls').find({ userId: interaction.user.id }).value();
        
        if(!guild) return;
        if(userInDatabase) return console.log(await interaction.reply({ embeds: [embed.alreadyCreatedCall], ephemeral: true }));
        if(userAlreadyOnCall(guild, interaction.user.id)) return interaction.reply({ embeds: [embed.alreadyOnCall], ephemeral: true });
        
        const createdChannel = await createChannel(`彡${interaction.values[0]}`, interaction.user.id, guild, config);
        if(!createdChannel) return interaction.reply({ embeds: [embed.error], ephemeral: true });
        
        const invite = await createdChannel.createInvite({ maxUses: 1 })
        const row = new MessageActionRow().addComponents(
            new MessageButton()
            .setLabel('Entre no Canal de Voz')
            .setURL(invite.url)
            .setStyle('LINK')
            );

        interaction.reply({ embeds: [embed.sucess], ephemeral: true, components: [row] });

        waitForUsersToJoin(createdChannel, interaction.user.id, guild);
    })
    
};


/* Functions */
async function waitForUsersToJoin(channel: VoiceChannel | undefined, userId: string, guild: any, lol: boolean = false) {
    if(channel === undefined) return;

    return new Promise<void | { id: string, delete: () => void }>(terminated => setTimeout(async () => {
        const usersInCall: GuildMember[] = [];
        await guild.channels.cache.get(channel.id).members.forEach((member: GuildMember) => {
            usersInCall.push(member);
        });

        if(usersInCall.length < 1) {
            !channel.deleted && channel.delete();
            db.get('usersThatCreatedCalls').remove({ userId: userId }).write();

            terminated();
        } else terminated(channel);
    }, 1000 * 15));
}
async function createChannel(channelName: string, userId: string, guild: Guild, config: IConfig) {
    if(!guild) return;
    const parent = guild.channels.cache.find(channel => channel.id === config.temporaryCalls.category);
    const everyone = guild.roles.everyone.id;
    
    const channel = await guild.channels.create(channelName, { 
        type: 'GUILD_VOICE', 
        parent: parent, 
        permissionOverwrites: [
            {
                id: everyone,
                allow: ['CONNECT', 'VIEW_CHANNEL']
            }
        ]
    });

    db.get('usersThatCreatedCalls').push({ userId: userId, channelId: channel.id }).write();

    return channel;
};
function userAlreadyOnCall(guild: Guild, memberId: string) {
    const member = guild.members.cache.find(member => member.id === memberId);
    if(!member) return;

    return !!member.voice.channel;
};
async function createControllerMessage(channel: NewsChannel | TextChannel, categories: any) {
    channel.bulkDelete(100);
    
    const options: MessageSelectOptionData[] = [];
    Object.entries(categories).forEach((category: any) => options.push({ label: category[0], value: category[0], description: category[1] }));

    console.log(options);

    const row = new MessageActionRow().addComponents(
        new MessageSelectMenu()
            .setCustomId('controllerMenu')
            .setPlaceholder('Selecione o canal de voz aqui')
            .addOptions(options)
    );

    return await channel.send({ embeds: [embed.controllerMessage], components: [row] });
}
async function fetchControllerMessage(channel: NewsChannel | TextChannel) {
    const allMessagesOfChannel = await channel.messages.fetch();

    if(allMessagesOfChannel.size > 1) return;

    const message = allMessagesOfChannel.first();

    if(!message?.components.length || message.components.length < 1) return;

    return message;
}
// function removeEmptyCalls(guild: Guild | undefined) {
//     if(!guild) return

//     const usersDB: IUserDb[] = db.get('usersThatCreatedCalls').value();
//     const usersDB2: IUserDb[] = db.get('boostersThatCreatedCalls').value();

//     usersDB.forEach(user => {
//         if(!user) return;

//         const findChannel = (id: string) => guild.channels.cache.find(channel => channel.id === id);

//         const dbChannel = db.get('usersThatCreatedCalls').find({ channelId: findChannel(user?.channelId)?.id }).value();

//         !!dbChannel && findChannel(user?.channelId)?.members.size === 0 
//             && db.get('usersThatCreatedCalls').remove({ channelId: findChannel(user?.channelId)?.id }).write();
            
//         findChannel(user?.channelId)?.members.size === 0 && findChannel(user?.channelId)?.delete();
//     });
//     usersDB2.forEach(user => {
//         if(!user) return;

//         const findChannel = (id: string) => guild.channels.cache.find(channel => channel.id === id);
        
//         const dbChannel = db.get('boostersThatCreatedCalls').find({ channelId: findChannel(user?.channelId)?.id }).value();

//         !!dbChannel && findChannel(user?.channelId)?.members.size === 0 
//             && db.get('boostersThatCreatedCalls').remove({ channelId: findChannel(user?.channelId)?.id }).write();
            
//         findChannel(user?.channelId)?.members.size === 0 && findChannel(user?.channelId)?.delete();
//     });
// }

/* Types */
type IUserDb = { userId: string, channelId: string } | undefined