"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __importDefault(require("../database"));
var db = database_1.default;
var features_reminder_1 = __importDefault(require("../embeds/features.reminder"));
module.exports = {
    name: 'Reminder',
    description: 'Lembra de algo em um certo dia, ou todos os dias.',
    execute: execute
};
function execute(client, config) {
    setInterval(function () {
        var date = new Date();
        var reminders = db.get('reminders').value();
        reminders.forEach(function (reminder) {
            var guild = client.guilds.cache.get(config.guildId);
            var postChannel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(config.reminder.postChannel);
            if (reminder.hours !== date.getHours())
                return;
            if (reminder.minutes !== date.getMinutes())
                return;
            (postChannel === null || postChannel === void 0 ? void 0 : postChannel.type) === 'text' && reminder.repeatEveryDay
                && postChannel.send(reminder.mentions, features_reminder_1.default.sendReminder(reminder));
            if (reminder.date !== date.getDate())
                return;
            if (reminder.month !== date.getMonth() + 1)
                return;
            if (reminder.year !== date.getFullYear())
                return;
            console.log(features_reminder_1.default.sendReminder(reminder));
            (postChannel === null || postChannel === void 0 ? void 0 : postChannel.type) === 'text' && !reminder.repeatEveryDay
                && postChannel.send(reminder.mentions, features_reminder_1.default.sendReminder(reminder));
            removeReminder(reminder);
        });
    }, 1000 * 60);
}
;
/* Functions */
function removeReminder(reminder) {
    db.get('reminders').remove({ title: reminder.title }).write();
}
;
