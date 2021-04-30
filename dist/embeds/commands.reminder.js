"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
exports.default = {
    timeOut: new discord_js_1.MessageEmbed()
        .setTitle('⚠ Tempo Acabou')
        .setDescription('Por favor escreva o comando novamente.')
        .setColor('#FFFF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),
    setTitle: new discord_js_1.MessageEmbed()
        .setTitle('Digite o Título'),
    setDescription: function (reminder) { return new discord_js_1.MessageEmbed()
        .setTitle(reminder.title)
        .setDescription('**Digite a Descrição**'); },
    repeatEveryDay: function (reminder) { return new discord_js_1.MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + "\n\n Repetir todo dias? y/n"); },
    setDate: function (reminder) { return new discord_js_1.MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + ("\n\n Repetir todo dias? " + reminder.repeatEveryDay + " \n\n __/00/0000")); },
    setMonth: function (reminder) { return new discord_js_1.MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + ("\n\n Repetir todo dias? " + reminder.repeatEveryDay + " \n\n " + reminder.date + "/__/0000")); },
    setYear: function (reminder) { return new discord_js_1.MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + ("\n\n Repetir todo dias? " + reminder.repeatEveryDay + " \n\n " + reminder.date + "/" + reminder.month + "/____")); },
    setHours: function (reminder) { return new discord_js_1.MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + ("\n\n Repetir todo dias? " + reminder.repeatEveryDay + " \n\n " + reminder.date + "/" + reminder.month + "/" + reminder.year + " \u00E0s __:00")); },
    setMinutes: function (reminder) { return new discord_js_1.MessageEmbed()
        .setDescription(reminder.description + ("\n\n Repetir todo dias? " + reminder.repeatEveryDay + " \n\n " + reminder.date + "/" + reminder.month + "/" + reminder.year + " \u00E0s " + reminder.hours + ":__")); },
    addMentions: function (reminder) { return new discord_js_1.MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + ("\n\n Repetir todo dias? " + reminder.repeatEveryDay + " \n\n " + reminder.date + "/" + reminder.month + "/" + reminder.year + " \u00E0s " + reminder.hours + ":" + reminder.minutes))
        .setFooter('**Digite os cargos ou pessoas que vão receber a notificação**'); },
    sucess: function (type) { return new discord_js_1.MessageEmbed()
        .setTitle('✅ Sucesso!')
        .setDescription(type === 'add' ? 'Seu lembrete foi guardado com sucesso!' : 'Seu lembrete foi removido com sucesso!')
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'); },
    missingArg: new discord_js_1.MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Você esqueceu de citar o título do lembrete que quer apagar, o jeito certo seria: `!reminder remove eita`')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>')
};
