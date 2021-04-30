import { Message, MessageEmbed } from "discord.js";

export default {
    fhanyLeftTheChat: new MessageEmbed()
        .setTitle('Fhany saiu do chat')
        .setDescription('A Fhany saiu do chat! Espero que ela volte logo! \nAté la, vamos esperá-la e **sem mencioná-la**, para não incomodar!')
        .setColor('#F55EB3')
        .setThumbnail('https://images.emojiterra.com/twitter/v13.0/128px/1f44b.png')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    fhanyIsActiveInChat: new MessageEmbed()
        .setTitle('Fhany está ativa no chat!')
        .setDescription('Oba! A fhany chegou! Os usuários **podem mencionar ela agora!** \nQue tal conversar com ela?')
        .setColor('#F55EB3')
        .setThumbnail('https://cdn.discordapp.com/avatars/811251945570041878/a5bada1a9bf2c713820453b5bb49ea86.png?size=256')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    
    mentionFhanyNotPermitted1: (message: Message) => new MessageEmbed()
        .setTitle('⚠ Aviso')
        .setDescription(`<@${message.author.id}>, você não pode enviar mensagem para a Fhany neste momento, ela não está ativa no chat. \n\nQuando ela estiver ativa eu avisarei, até lá, não mencione ela outra vez.`)
        .setColor('#FFFF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    mentionFhanyNotPermitted2: (message: Message) => new MessageEmbed()
        .setTitle('⚠ Aviso')
        .setDescription(`Este é seu último aviso <@${message.author.id}>, não mencione a Fhany mais uma vez. Ela não está ativa no chat!`)
        .setColor('#FFFF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    mentionFhanyNotPermitted3: (message: Message) => new MessageEmbed()
        .setTitle('⚠ Aviso')
        .setDescription(`Usuário <@${message.author.id}> foi silenciado por mencionar a Fhany.`)
        .setColor('#FFFF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
}