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
    help: new discord_js_1.MessageEmbed()
        .setTitle('Create Call')
        .setDescription('Este comando cria um canal de voz para você onde você é o dono e pode mudar permissões com o comando `setcall` \n\nPara criar uma call, você pode escolher entre criar uma call privada ou pública. A privada, só você e os moderadores tem direito de ver a call, na Pública, qualquer pessoa pode entrar na sua call.')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>')
        .setColor('#F55EB3'),
};
