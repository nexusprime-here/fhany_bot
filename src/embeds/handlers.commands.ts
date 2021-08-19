import { MessageEmbed } from "discord.js";

export default {
    notDM: new MessageEmbed()
        .setTitle('❌ Desculpe mas..')
        .setDescription('Você não pode usar esse comando no DM, somente no servidor!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    
    missingArgs: new MessageEmbed()
        .setTitle('Você esqueceu seus argumentos')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    timeNotExpired: (timeLeft: string, commandName: string) => new MessageEmbed()
        .setTitle('⚠ Ei! Vai com calma!')
        .setDescription(`Espere mais ${timeLeft} segundos antes de usar o comando ${commandName} de novo!`)
        .setColor('#FFFF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    commandNotWork: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Este comando ainda não está funcionando, tente novamente mais tarde.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    missingRole: (roles: string[]) => new MessageEmbed()
        .setTitle('❌ Sem role')
        .setDescription(`Você não tem cargo para executar esse comando. \n\n Você precisa de um dos cargos: ${transformInTag(roles).join(', ')}`)
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    notBooster: new MessageEmbed()
        .setTitle('<a:booster:840231970696462397> Seja booster')
        .setDescription('Você não pode usar este comando pois você não deu boost no servidor ainda. \n\nDe boost agora e ajude o servidor, alem de ter várias vantagens descritas no <#797930500231790633>!')
        .setColor('#FF5EF4')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
}

function transformInTag(roles: string[]) {
    const newArray: string[] = [];

    roles.forEach(role => newArray.push(`<@&${role}>`));

    return newArray;
}