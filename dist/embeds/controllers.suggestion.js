"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
exports.default = {
    messageSent: function (userId) { return new discord_js_1.MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription("<@" + userId + ">, sua sugest\u00E3o foi enviada com sucesso! \nEm 15 minutos ou menos, ela ir\u00E1 aparecer nas sugest\u00F5es.")
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'); },
    reactionSent: new discord_js_1.MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription('Sua avalição foi enviada com sucesso! \nEm 10 minutos ou menos, ela irá aparecer na mensagem reagida.')
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
};
