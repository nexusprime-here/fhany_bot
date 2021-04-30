"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
exports.default = {
    notExistMessageReference: new discord_js_1.MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Você esqueceu de marcar uma sugestão!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    suggestionReject: new discord_js_1.MessageEmbed()
        .setTitle('Sugestão rejeitada')
        .setDescription('Sua sugestão não foi aceita e a staff prefiriu removê-la.')
        .setColor('#F55EB3')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    sucess: new discord_js_1.MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription('A sugestão que você marcou foi rejeitada com sucesso!')
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
};
