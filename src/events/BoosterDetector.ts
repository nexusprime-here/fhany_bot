import { EmbedFieldData } from 'discord.js';
import { commands } from '../';

import embed from "../embeds/events.BoosterDetector";
import { IEvent } from "../handlers/events";

const boosterDetector: IEvent = {
    active: true,
    name: 'Detector Booster',
    description: 'Envia uma mensagem de agradecimento e explicações de comandos booster do bot à membros que deram boost ao servidor.',
    type: 'guildMemberUpdate',
    async execute(config, oldData, newData) { // this properties is any[]
        const mappedCommands: EmbedFieldData[] = [];
        commands.forEach(command => {
            if(!command || command.forRoles !== 'booster') return;

            mappedCommands.push({ name: command.name, value: command.description });
        });
        
        const hadRole = oldData.roles.cache.get(config.roles.boosters);
        const hasRole = newData.roles.cache.get(config.roles.boosters);
        
        if (!hadRole && hasRole) {
            newData.user.send({ embeds: [embed.message.setFields(mappedCommands)] });
        }
    }
}

module.exports = boosterDetector;