"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
exports.default = {
    notExistMessageReference: new discord_js_1.MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Você esqueceu de marcar uma sugestão!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    suggestionAccept: new discord_js_1.MessageEmbed()
        .setTitle('Sugestão aceita!')
        .setDescription('Oba! Sua sugestão foi aceita pela staff! Continue assim!!')
        .setColor('#F55EB3')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    sucess: new discord_js_1.MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription('A sugestão que você marcou foi aceita com sucesso!')
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    editSuggestionMessage: function (author, description, fields, footer) { return new discord_js_1.MessageEmbed()
        .setAuthor(author.name, author.iconURL)
        .setTitle('Aceito')
        .setDescription(description)
        .addFields(fields)
        .setFooter(footer.text)
        .setColor('#00FF00'); }
};
