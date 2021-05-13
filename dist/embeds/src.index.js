"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
exports.default = {
    notDM: new discord_js_1.MessageEmbed()
        .setTitle('❌ Desculpe mas..')
        .setDescription('Você não pode usar esse comando no DM, somente no servidor!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    missingArgs: new discord_js_1.MessageEmbed()
        .setTitle('Você esqueceu seus argumentos')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    timeNotExpired: function (timeLeft, commandName) { return new discord_js_1.MessageEmbed()
        .setTitle('⚠ Ei! Vai com calma!')
        .setDescription("Espere mais " + timeLeft + " segundos antes de usar o comando " + commandName + " de novo!")
        .setColor('#FFFF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'); },
    commandNotWork: new discord_js_1.MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Este comando ainda não está funcionando, tente novamente mais tarde.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    missingRole: function (roles) { return new discord_js_1.MessageEmbed()
        .setTitle('❌ Sem role')
        .setDescription("Voc\u00EA n\u00E3o tem cargo para executar esse comando. \n\n Voc\u00EA precisa de um dos cargos: " + transformInTag(roles).join(', '))
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'); },
    notBooster: new discord_js_1.MessageEmbed()
        .setTitle('<a:booster:840231970696462397> Seja booster')
        .setDescription('Você não pode usar este comando pois você não deu boost no servidor ainda. \n\nDe boost agora e ajude o servidor, alem de ter várias vantagens descritas no <#797930500231790633>!')
        .setColor('#FF5EF4')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
};
function transformInTag(roles) {
    var newArray = [];
    roles.forEach(function (role) { return newArray.push("<@&" + role + ">"); });
    return newArray;
}
