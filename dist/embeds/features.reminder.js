"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
exports.default = {
    sendReminder: function (reminder) { return new discord_js_1.MessageEmbed()
        .setTitle("Lembrete: " + reminder.title)
        .setDescription(reminder.description)
        .setFooter(reminder.repeatEveryDay ? 'Programado para repetir todos os dias' : '')
        .setColor('#F55EB3'); }
};
