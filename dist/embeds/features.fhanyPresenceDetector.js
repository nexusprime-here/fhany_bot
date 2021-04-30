"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
exports.default = {
    fhanyLeftTheChat: new discord_js_1.MessageEmbed()
        .setTitle('Fhany saiu do chat')
        .setDescription('A Fhany saiu do chat! Espero que ela volte logo! \nAté la, vamos esperá-la e **sem mencioná-la**, para não incomodar!')
        .setColor('#F55EB3')
        .setThumbnail('https://images.emojiterra.com/twitter/v13.0/128px/1f44b.png')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    fhanyIsActiveInChat: new discord_js_1.MessageEmbed()
        .setTitle('Fhany está ativa no chat!')
        .setDescription('Oba! A fhany chegou! Os usuários **podem mencionar ela agora!** \nQue tal conversar com ela?')
        .setColor('#F55EB3')
        .setThumbnail('https://cdn.discordapp.com/avatars/811251945570041878/a5bada1a9bf2c713820453b5bb49ea86.png?size=256')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    mentionFhanyNotPermitted1: function (message) { return new discord_js_1.MessageEmbed()
        .setTitle('⚠ Aviso')
        .setDescription("<@" + message.author.id + ">, voc\u00EA n\u00E3o pode enviar mensagem para a Fhany neste momento, ela n\u00E3o est\u00E1 ativa no chat. \n\nQuando ela estiver ativa eu avisarei, at\u00E9 l\u00E1, n\u00E3o mencione ela outra vez.")
        .setColor('#FFFF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'); },
    mentionFhanyNotPermitted2: function (message) { return new discord_js_1.MessageEmbed()
        .setTitle('⚠ Aviso')
        .setDescription("Este \u00E9 seu \u00FAltimo aviso <@" + message.author.id + ">, n\u00E3o mencione a Fhany mais uma vez. Ela n\u00E3o est\u00E1 ativa no chat!")
        .setColor('#FFFF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'); },
    mentionFhanyNotPermitted3: function (message) { return new discord_js_1.MessageEmbed()
        .setTitle('⚠ Aviso')
        .setDescription("Usu\u00E1rio <@" + message.author.id + "> foi silenciado por mencionar a Fhany.")
        .setColor('#FFFF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'); },
};
