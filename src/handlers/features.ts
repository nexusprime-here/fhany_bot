import fs from 'fs';
import Discord from 'discord.js';
import { features, IConfig, IHandler } from '..';
import chalk from 'chalk';

const featuresFiles = fs.readdirSync('./dist/features').filter(file => file.endsWith('.js'));

const featuresExport: IHandler = (client, config) => {
    console.log(chalk.black.bgMagenta('\nLoading features'));

    for (const file of featuresFiles) {
        console.log(`${chalk.magenta('  |')} ${file} `);

        try {
            const feature: IFeature = require(`../features/${file}`);
            if(!feature.active) continue;
            
            features.set(feature.name, feature)
            
            client.guilds.cache.forEach(guild => feature.execute(client, config, guild))
        } catch (err) {
            console.log(err);
            
            process.exit();
        }
    }
}

module.exports = featuresExport;


/* Types */
export type IFeature = {
    name: string,
	description: string,
	active: boolean
	execute: (client: Discord.Client, config: IConfig, guild: Discord.Guild) => void;
}