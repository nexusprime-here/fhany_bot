import { Client, Message } from "discord.js";
import { IConfig } from "..";
import db from '../database';

import embed from "../embeds/commands.reminder";

module.exports = {
    name: 'lembrete', 
    description: 'Aceita uma sugestão do canal sugestões',
    async execute(message: Message, args: any[], client: Client, config: IConfig) {
        const arg: 'adicionar' | 'remover' = args[0]

        if(arg === undefined) return message.reply(embed.help(config.prefix))

        const acceptedArgs = {
            'adicionar': async () => {
                const newMessage = await message.channel.send({ embed: { description: 'Carregando...' } });
                if(!newMessage) return;
                
                const allReminderData: () => IReminder = () => { 
                    return { 
                        title, description, repeatEveryDay, date, month, year, hours, minutes, mentions
                    }
                };

                try {
                    var title = await getTitle(newMessage);
                    if(!title) return;

                    var description = await getDescription(newMessage, allReminderData());
                    if(!description) return;

                    var repeatEveryDay = await getRepeat(newMessage, allReminderData());
                    if(repeatEveryDay === undefined) return;

                    var date = await getDate(newMessage, allReminderData());
                    if(!date) return;

                    var month = await getMonth(newMessage, allReminderData());
                    if(!month) return;

                    var year = await getYear(newMessage, allReminderData());
                    if(!year) return;

                    var hours = await getHours(newMessage, allReminderData());
                    if(!hours) return;

                    var minutes = await getMinutes(newMessage, allReminderData());
                    if(!minutes) return;

                    var mentions = await getMentions(newMessage, allReminderData());
                    if(!mentions) return;
                } catch {
                    return newMessage.edit(embed.timeOut);
                }
                
                await db.get('reminders').push({ 
                    title, description, repeatEveryDay, date, month, year, hours, minutes, mentions
                }).write();

                newMessage.edit(embed.sucess('add'));
            },
            'remover': () => {}
        };

        !!acceptedArgs[arg] && acceptedArgs[arg]();

        
        /* Functions */
        const filter = (m: Message) => m.author.id === message.author.id;
        const filterConfig = { max: 1, time: 1000 * 20, errors: ['time'] }

        async function getTitle(message: Message) {
            await message.edit(embed.setTitle);
            let title = (await message.channel.awaitMessages(filter, filterConfig)).first(); // bug
            title?.delete();

            if(title && title.content.length > 50) {
                await message.edit({ embed: { color: '#e31c17', title: '❌ Título muito grande!' } });

                return;
            }

            return title ? title.content : ''
        }
        async function getDescription(message: Message, thisObject: IReminder) {
            await message.edit(embed.setDescription(thisObject));
            let description = (await message.channel.awaitMessages(filter, filterConfig)).first();
            description?.delete();

            if(description && description.content.length > 1700) {
                await message.edit({ embed: { color: '#e31c17', title: '❌ Descrição muito grande!' } });

                return;
            }

            return description ? description.content : ''
        }
        async function getRepeat(message: Message, thisObject: IReminder) {
            await message.edit(embed.repeatEveryDay(thisObject));
            let repeat = (await message.channel.awaitMessages(filter, filterConfig)).first();
            repeat?.delete();

            if(repeat && repeat.content.toLowerCase() !== 'y' && repeat.content.toLowerCase() !== 'n') {
                await message.edit({ embed: { color: '#e31c17', title: '❌ Resposta Inválida.' } });

                return;
            }
            
            return repeat?.content.toLowerCase() === 'y' ? true : false;
        }
        async function getDate(message: Message, thisObject: IReminder) {
            await message.edit(embed.setDate(thisObject));
            let date = (await message.channel.awaitMessages(filter, filterConfig)).first();
            date?.delete();

            if(date && (parseInt(date.content) > 31 || parseInt(date.content) < 1)) {
                await message.edit({ embed: { color: '#e31c17', title: '❌ Dia Inválido.' } });

                return;
            }

            return date ? parseInt(date.content) : 0;
        }
        async function getMonth(message: Message, thisObject: IReminder) {
            await message.edit(embed.setMonth(thisObject));
            let month = (await message.channel.awaitMessages(filter, filterConfig)).first();
            month?.delete();

            if(month && (parseInt(month.content) > 31 || parseInt(month.content) < 1)) {
                await message.edit({ embed: { color: '#e31c17', title: '❌ Mês Inválido.' } });

                return;
            }

            return month ? parseInt(month.content) : 0;
        }
        async function getYear(message: Message, thisObject: IReminder) {
            await message.edit(embed.setYear(thisObject));
            let year = (await message.channel.awaitMessages(filter, filterConfig)).first();
            year?.delete();

            if(year && parseInt(year.content) < new Date().getFullYear()) {
                await message.edit({ embed: { color: '#e31c17', title: '❌ Ano Inválido.' } });

                return;
            }
            
            return year ? parseInt(year.content) : 0;
        }
        async function getHours(message: Message, thisObject: IReminder) {
            await message.edit(embed.setHours(thisObject));
            let hours = (await message.channel.awaitMessages(filter, filterConfig)).first();
            hours?.delete();

            if(hours && (parseInt(hours.content) > 23 || parseInt(hours.content) < 0)) {
                await message.edit({ embed: { color: '#e31c17', title: '❌ Hora Inválida.' } });

                return;
            }

            return hours ? parseInt(hours.content) : 0;
        }
        async function getMinutes(message: Message, thisObject: IReminder) {
            await message.edit(embed.setMinutes(thisObject));
            let minutes = (await message.channel.awaitMessages(filter, filterConfig)).first();
            minutes?.delete();

            if(minutes && (parseInt(minutes.content) > 59 || parseInt(minutes.content) < 0)) {
                await message.edit({ embed: { color: '#e31c17', title: '❌ Minutos Inválido.' } });

                return;
            }

            return minutes ? parseInt(minutes.content) : 0;
        }
        async function getMentions(message: Message, thisObject: IReminder) {
            await message.edit(embed.addMentions(thisObject));
            let mentions = (await message.channel.awaitMessages(filter, filterConfig)).first();
            mentions?.delete();

            return mentions ? mentions.content : ''; 
        }
    }
}

export interface IReminder {
    title?: string | undefined, 
    description?: string | undefined,
    repeatEveryDay?: boolean | undefined,
    date?: number,
    month?: number,
    year?: number,
    hours?: number,
    minutes?: number,
    mentions?: string | undefined
}