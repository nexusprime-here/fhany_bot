import { Client } from "discord.js";
import database from "../database";
const db = database;

import embed from '../embeds/features.reminder';
import { IReminder } from "../commands/reminder";

module.exports = {
    name: 'Reminder',
    description: 'Lembra de algo em um certo dia, ou todos os dias.',
    execute
};

function execute(client: Client, config: any) {setInterval(() => {
    const date = new Date();

    const reminders: IReminder[] = db.get('reminders').value();
    
    reminders.forEach(reminder => {
        const guild = client.guilds.cache.get(config.guildId);
        const postChannel: any = guild?.channels.cache.get(config.reminder.postChannel); 

        if(reminder.hours !== date.getHours()) return;
        if(reminder.minutes !== date.getMinutes()) return;

        postChannel?.type === 'text' && reminder.repeatEveryDay 
            && postChannel.send(reminder.mentions, embed.sendReminder(reminder));

        if(reminder.date !== date.getDate()) return;
        if(reminder.month !== date.getMonth() + 1) return;
        if(reminder.year !== date.getFullYear()) return;

        console.log(embed.sendReminder(reminder))
        postChannel?.type === 'text' && !reminder.repeatEveryDay 
            && postChannel.send(reminder.mentions, embed.sendReminder(reminder));

        removeReminder(reminder);
    });
}, 1000 * 60)};


/* Functions */
function removeReminder(reminder: IReminder) {
    db.get('reminders').remove({ title: reminder.title }).write();
};