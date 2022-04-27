import fs from 'fs';
import Discord from 'discord.js';
import { IHandler, ModifiedClient } from '../main';
import chalk from 'chalk';
import path from 'path';

const eventFiles = fs.readdirSync(path.join(process.cwd(), 'src', 'events'));

export function createEvent<K extends keyof Discord.ClientEvents>(e: IEvent<K>): IEvent<K> {
    return e;
}

const events: IHandler = async client => {
    console.log(chalk.black.bgYellowBright('\nLoading events'));

    (async function executeEvents(files: typeof eventFiles | IEvent[]) {
        for (const file of files) {
            const event: IEvent | IEvent[] = await async function() {
                if(typeof file === 'string') {
                    return (await import(`../events/${file}`)).default;
                } else {
                    return file;
                }
            }();
    
            if(Array.isArray(event)) {
                executeEvents(event);
                continue;
            }

            if(!event.active) continue;
            client.events.set(event.name, event);
            
            console.log(`${chalk.yellowBright('  |')} ${event.name} `);
            
            client[event.once ? 'once' : 'on'](event.type, async (...args: any) => {
                try {
                    await event.execute(client, ...args);
                } catch (err) {
                    console.error(chalk.black.bgRed(`Erro no Event ${event.name}:`));
                    console.error(err);
                }
            });
        }
    })(eventFiles);
}

export default events;


/* Types */
export type IEvent<K extends keyof Discord.ClientEvents = any> = {
    active: boolean,
	name: string,
	description: string,
	type: K,
	once?: boolean,
	execute: (client: ModifiedClient, ...args: Discord.ClientEvents[K]) => Promise<any>
}