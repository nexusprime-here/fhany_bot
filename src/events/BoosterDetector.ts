import { Client, GuildMember } from "discord.js";
import { commands, IConfig } from '../';

import embed from "../embeds/events.BoosterDetector";

module.exports = {
    name: 'guildMemberUpdate',
    execute(oldData: GuildMember, newData: GuildMember, client: Client, config: IConfig) {
        if(oldData.premiumSince === newData.premiumSince) return;

        commands.forEach(command => {
            if(!command.booster) return;

            embed.message.addField(command.name, `${command.description} \n\nComo usar: \`${config.prefix}${command.name} ${command.usage}\``);
        });
        

        newData.user.send(embed.message);
    }
}