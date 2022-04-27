import fs from 'fs';
import Discord from 'discord.js';
import chalk from 'chalk';
import path from 'path';

import { IHandler, ModifiedClient } from '../main';
import idCache from '../database/ids';

const featuresFiles = fs.readdirSync(path.join(process.cwd(), 'src', 'features'));

export function createFeature(e: IFeature): IFeature {
    return e;
}

const features: IHandler = async client => {
    console.log(chalk.black.bgMagenta('\nLoading features'));

    for (const file of featuresFiles) {
        const feature: IFeature = (await import(`../features/${file}`)).default;
        
        if(!feature.active) continue;
        client.features.set(feature.name, feature);
    
        console.log(`${chalk.magenta('  |')} ${feature.name} `);

        try {
            const guild = client.guilds.cache.get(<string>await idCache.get('guildId'));
            if(!guild) throw new Error('Guild not found');

            await feature.execute(guild, {
                commands: client.commands,
                events: client.events,
                features: client.features,
            });
        } catch (err) {
            console.error(chalk.black.bgRed(`Erro no Feature ${feature.name}:`));
            console.error(err);
        }
    }
}

export default features;


/* Types */
type _props = { 
    commands: ModifiedClient['commands'],
    events: ModifiedClient['events'],
    features: ModifiedClient['features']
}
export type IFeature = {
    name: string,
	description: string,
	active: boolean,
	execute: (guild: Discord.Guild, props: _props) => Promise<any>;
}