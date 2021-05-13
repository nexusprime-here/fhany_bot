"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
exports.default = {
    nameVeryLarge: new discord_js_1.MessageEmbed()
        .setTitle('❌ Nome muito grande')
        .setDescription('O nome do Canal está muito grande, não pode passar de 20 caracteres!')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    typeNotExist: new discord_js_1.MessageEmbed()
        .setTitle('❌ Tipo de canal inválido')
        .setDescription('O tipo do canal selecionado não existe, atualmente você pode selecionar entre: `publico` e `privado`.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    channelCreated: function (privado, channelId) { return new discord_js_1.MessageEmbed()
        .setTitle('✅ Sucesso')
        .setDescription("O seu canal de voz " + (privado ? 'privado' : 'público') + " foi criado com sucesso. \n\n<#" + channelId + ">")
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'); },
    alreadyCreated: new discord_js_1.MessageEmbed()
        .setTitle('❌ Canal já existe')
        .setDescription('Você já tem um canal de voz, não pode criar outro enquanto ele existir.')
        .setColor('#e31c17')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    help: function (prefix, command) { return new discord_js_1.MessageEmbed()
        .setTitle(command)
        .setDescription("Este comando cria um canal de voz para voc\u00EA onde voc\u00EA \u00E9 o dono e pode mudar permiss\u00F5es com o comando `setcall`. \n\nPara criar uma call, voc\u00EA pode escolher entre criar uma call privada ou p\u00FAblica. A privada, s\u00F3 voc\u00EA e os moderadores tem direito de ver a call, na P\u00FAblica, qualquer pessoa pode entrar na sua call. Ex: \n\n`" + prefix + command + " publico call feliz :D` \n`" + prefix + command + " privado call feliz :D`")
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>')
        .setColor('#F55EB3'); },
};
