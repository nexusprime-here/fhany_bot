import { MessageEmbed } from "discord.js";

export default {
    messageSent: (userId: string) => new MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription(`<@${userId}>, sua sugestão foi enviada com sucesso! \nEm 15 minutos ou menos, ela irá aparecer nas sugestões.`)
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    reactionSent: new MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription('Sua avalição foi enviada com sucesso! \nEm 10 minutos ou menos, ela irá aparecer na mensagem reagida.')
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
}