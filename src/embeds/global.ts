import { MessageEmbed } from "discord.js"

export const globalCommon = () => new MessageEmbed()
    .setColor('#F55EB3')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');

export const globalWarn = (content?: string) => new MessageEmbed()
    .setDescription(content ? `⚠ | ${content}` : '⚠ | Aviso')
    .setColor('#FFFF00')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');

export const globalError = (content?: string) => new MessageEmbed()
    .setDescription(content ? `❌ | ${content}` : '❌ | Whoops..')
    .setColor('#e31c17')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');
    
export const globalSuccess = (content?: string) => new MessageEmbed()
    .setDescription(content ? `✅ | ${content}` : '✅ | Sucesso')
    .setColor('#00FF00')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');
