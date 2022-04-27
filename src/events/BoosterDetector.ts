import { EmbedFieldData } from 'discord.js';
import { Embed } from '../main';
import idCache from '../database/ids';
import { createEvent } from "../handlers/events";

export default createEvent({
    active: true,
    name: 'Detector Booster',
    description: 'Envia uma mensagem de agradecimento e explicações de comandos booster do bot à membros que deram boost ao servidor.',
    type: 'guildMemberUpdate',
    async execute(client, oldData, newData) {
        const mappedCommands: EmbedFieldData[] = [];
        client.commands.forEach(command => {
            if(!command || command.forRoles !== 'booster') return;

            mappedCommands.push({ name: command.name, value: command.description });
        });

        const boosterRoleId = (await idCache.get('roles'))?.booster;
        if(!boosterRoleId) return;

        const hadRole = oldData.roles.cache.get(boosterRoleId);
        const hasRole = newData.roles.cache.get(boosterRoleId);
        
        if (!hadRole && hasRole) {
            newData.user.send(Embed.create('Info', {
                title: 'Obrigado!',
                description: 'Obrigado por dar boost em nosso server, e como prometido, agora você tem comandos únicos para usar!',
                fields: mappedCommands
            }));
        }
    }
});