import { Message, MessageEmbed } from "discord.js";
import { IReminder } from "../commands/reminder";

export default {
    sendReminder: (reminder: IReminder) => new MessageEmbed()
        .setTitle(`Lembrete: ${reminder.title}`)
        .setDescription(reminder.description)
        .setFooter(reminder.repeatEveryDay ? 'Programado para repetir todos os dias' : '')
        .setColor('#F55EB3')
}