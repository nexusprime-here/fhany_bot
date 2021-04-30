import { MessageEmbed } from "discord.js";
import { IReminder } from "../commands/reminder";

export default {
    timeOut: new MessageEmbed()
        .setTitle('⚠ Tempo Acabou')
        .setDescription('Por favor escreva o comando novamente.')
        .setColor('#FFFF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    setTitle: new MessageEmbed()
        .setTitle('Digite o Título'),

    setDescription: (reminder: IReminder) => new MessageEmbed()
        .setTitle(reminder.title)
        .setDescription('**Digite a Descrição**'),

    repeatEveryDay: (reminder: IReminder) => new MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + `\n\n Repetir todo dias? y/n`),

    setDate: (reminder: IReminder) => new MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + `\n\n Repetir todo dias? ${reminder.repeatEveryDay} \n\n __/00/0000`),

    setMonth: (reminder: IReminder) => new MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + `\n\n Repetir todo dias? ${reminder.repeatEveryDay} \n\n ${reminder.date}/__/0000`),

    setYear: (reminder: IReminder) => new MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + `\n\n Repetir todo dias? ${reminder.repeatEveryDay} \n\n ${reminder.date}/${reminder.month}/____`),

    setHours: (reminder: IReminder) => new MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + `\n\n Repetir todo dias? ${reminder.repeatEveryDay} \n\n ${reminder.date}/${reminder.month}/${reminder.year} às __:00`),

    setMinutes: (reminder: IReminder) => new MessageEmbed()
        .setDescription(reminder.description + `\n\n Repetir todo dias? ${reminder.repeatEveryDay} \n\n ${reminder.date}/${reminder.month}/${reminder.year} às ${reminder.hours}:__`),

    addMentions: (reminder: IReminder) => new MessageEmbed()
        .setTitle(reminder.title)
        .setDescription(reminder.description + `\n\n Repetir todo dias? ${reminder.repeatEveryDay} \n\n ${reminder.date}/${reminder.month}/${reminder.year} às ${reminder.hours}:${reminder.minutes}`)
        .setFooter('**Digite os cargos ou pessoas que vão receber a notificação**'),

    sucess: (type: 'add' | 'remove') => new MessageEmbed()
        .setTitle('✅ Sucesso!')
        .setDescription(type === 'add' ? 'Seu lembrete foi guardado com sucesso!' : 'Seu lembrete foi removido com sucesso!')
        .setColor('#00FF00')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>'),

    missingArg: new MessageEmbed()
        .setTitle('❌ Whoops..')
        .setDescription('Você esqueceu de citar o título do lembrete que quer apagar, o jeito certo seria: `!reminder remove eita`')
        .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>')
}