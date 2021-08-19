import fs from 'fs';
import Discord from 'discord.js';
import { events, IConfig, IHandler } from '..';
import chalk from 'chalk';

const eventFiles = fs.readdirSync('./dist/events').filter(file => file.endsWith('.js'));

const eventsExport: IHandler = (client, config) => {
    console.log(chalk.black.bgYellowBright('\nLoading events'));

    for (const file of eventFiles) {
        console.log(`${chalk.yellowBright('  |')} ${file} `);
        
        const event: IEvent = require(`../events/${file}`);
        
        if(!event.active) continue;
        
        events.set(event.name, event);
        
        if (event.once) {
            client.once(event.type, (...args) => event.execute(config, ...args));
        } else {
            client.on(event.type, (...args) => event.execute(config, ...args));
        }
    }
}

module.exports = eventsExport;


/* Types */
export type IEvent = {
    active: boolean,
	name: string,
	description: string,
	type: keyof Discord.ClientEvents,
	once?: boolean,
	execute: (config: IConfig, ...args: any[]) => void
}