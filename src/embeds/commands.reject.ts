import { MessageEmbed } from "discord.js";

export default {
    notExistMessageReference: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Você esqueceu de marcar uma sugestão!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    suggestionReject: new MessageEmbed()
        .setTitle('Sugestão rejeitada')
        .setDescription('Sua sugestão não foi aceita e a staff prefiriu removê-la.')
        .setColor('#F55EB3')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    sucess: new MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription('A sugestão que você marcou foi rejeitada com sucesso!')
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
}