"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var configtest_json_1 = require("../config/configtest.json");
exports.default = {
    notCreatedChannel: new discord_js_1.MessageEmbed()
        .setTitle('❌ Crie um canal primeiro')
        .setDescription("Para configurar uma call, voc\u00EA precisa ter uma, para criar, utilize o comando `" + configtest_json_1.prefix + "createcall`")
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    invalidOptions: function (options) { return new discord_js_1.MessageEmbed()
        .setTitle('❌ Opção inválida')
        .setDescription('A opção que você selecionou é invalida, você pode escolher entre ' + options.join(' '))
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'); },
    sucessMessage: function (userId, permission, boolean) { return new discord_js_1.MessageEmbed()
        .setTitle('✅ Sucesso!')
        .setDescription("O usu\u00E1rio <@" + userId + "> teve uma a permiss\u00E3o `" + permission + "` mudado para o estado `" + boolean + "` com sucesso!")
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'); },
};
