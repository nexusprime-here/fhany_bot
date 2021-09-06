import { MessageEmbed } from "discord.js"

export const globalCommon = () => new MessageEmbed()
    .setColor('#F55EB3')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');

export const globalWarn = () => new MessageEmbed()
    .setTitle(`⚠ │ Aviso`)
    .setColor('#ffd336')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');

export const globalError = (title?: string) => new MessageEmbed()
    .setTitle(`❌ │ ${title ? title : 'Whoops..'}`)
    .setColor('#ba2d42')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');
    
export const globalSuccess = (title?: string) => new MessageEmbed()
    .setTitle(`✅ │ ${title ? title : 'Sucesso!'}`)
    .setColor('#69b84f')
    .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>');
