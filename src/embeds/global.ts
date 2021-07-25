import { MessageEmbed } from "discord.js"

export const globalCommon = () => new MessageEmbed()
    .setColor('#F55EB3')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');

export const globalWarn = () => new MessageEmbed()
    .setTitle('⚠ Aviso')
    .setColor('#FFFF00')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');

export const globalError = () => new MessageEmbed()
    .setTitle('❌ Whoops..')
    .setColor('#e31c17')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');

export const globalSucess = () => new MessageEmbed()
    .setTitle('✅ Sucesso')
    .setColor('#00FF00')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');
