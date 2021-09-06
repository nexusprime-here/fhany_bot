import { 
    Guild, GuildMember, MessageActionRow, 
    MessageButton, MessageSelectMenu, MessageSelectOptionData, 
    NewsChannel, TextChannel, VoiceChannel 
} from "discord.js";
import { IConfig } from "..";
import db from '../database';

import embed from '../embeds/features.temporaryCalls'
import { IFeature } from "../handlers/features";

const temporaryCalls: IFeature = {
    active: true,
    name: 'Temporary Calls',
    description: 'Cria um canal de voz que quando ninguém está usando, ela é excluida.',
    async execute(client, config, guild) {
        const controllerChannel = <TextChannel>guild?.channels.cache.get(config.features.temporaryCalls.controllerChannel);
    
        removeEmptyCalls(guild);

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
            if(userInDatabase) return await interaction.reply({ embeds: [embed.alreadyCreatedCall], ephemeral: true });
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
    
            interaction.reply({ embeds: [embed.success], ephemeral: true, components: [row] });
    
            const usersNotJoin = await waitForUsersToJoin(createdChannel);
            if(usersNotJoin) {
                createdChannel.delete();
                db.get('usersThatCreatedCalls').remove({ userId: interaction.user.id }).write();
            }
        });
    }
}

module.exports = temporaryCalls;


/* Functions */
function removeEmptyCalls(guild: Guild | undefined) {
    if(!guild) return;

    const usersInDb: IUserDb[] = db.get('usersThatCreatedCalls').value();
    const usersInDbBoosters: IUserDb[] = db.get('boostersThatCreatedCalls').value();

    const findChannel = (id: string) => guild.channels.cache.get(id);

    usersInDb.forEach(user => {
        if(!user) return;

        const channelInDb = db.get('usersThatCreatedCalls').find({ channelId: findChannel(user.channelId)?.id }).value();
        
        const foundChannel = <VoiceChannel>findChannel(user.channelId);

        if(channelInDb && foundChannel.members.size === 0) {
            db.get('usersThatCreatedCalls').remove({ channelId: foundChannel.id }).write();
            foundChannel.delete();
        }
    });
    usersInDbBoosters.forEach(user => {
        if(!user) return;

        const channelInDb = db.get('boostersThatCreatedCalls').find({ channelId: findChannel(user?.channelId)?.id }).value();

        const foundChannel: any = findChannel(user.channelId);

        if(channelInDb && foundChannel.members.size === 0) {
            db.get('usersThatCreatedCalls').remove({ channelId: foundChannel.id }).write();
            foundChannel.delete();
        }
    });
}
async function waitForUsersToJoin(channel: VoiceChannel | undefined): Promise<boolean> {
    if(!channel) return false;

    return new Promise(terminated => setTimeout(async () => {
        const usersInCall = channel.members.map((member: GuildMember) => {
            return member;
        });
        
        if(channel.deleted || usersInCall.length > 0) return terminated(false);
        terminated(true)
    }, 1000 * 15))
}
async function createChannel(channelName: string, userId: string, guild: Guild, config: IConfig) {
    if(!guild) return;
    const parent = guild.channels.cache.get(config.features.temporaryCalls.category);

    const everyone = guild.roles.everyone.id;
    
    const channel = await guild.channels.create(channelName, { 
        type: 'GUILD_VOICE', 
        parent: parent?.id,
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
    const member = guild.members.cache.get(memberId);
    if(!member) return;

    return !!member.voice.channel;
};
async function createControllerMessage(channel: NewsChannel | TextChannel, categories: any) {
    channel.bulkDelete(100);
    
    const options: MessageSelectOptionData[] = [];
    Object.entries(categories).forEach((category: any) => options.push({ label: category[0], value: category[0], description: category[1] }));

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

/* Types */
type IUserDb = { userId: string, channelId: string } | undefined