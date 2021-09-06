import fs from 'fs';
import Discord, { Client, ClientEvents } from 'discord.js';
import { client, features, IConfig, IHandler } from '..';
import chalk from 'chalk';

const featuresFiles = fs.readdirSync('./dist/features').filter(file => file.endsWith('.js'));

const featuresExport: IHandler = (client, config) => {
    console.log(chalk.black.bgMagenta('\nLoading features'));

    for (const file of featuresFiles) {
        const feature: IFeature = require(`../features/${file}`);
        if(!feature.active) continue;
    
        console.log(`${chalk.magenta('  |')} ${file} `);
        
        features.set(feature.name, feature);

        client.guilds.cache.forEach(async guild => {
            try {    
                await feature.execute(client, config, guild);
            } catch (err) {
                console.error(chalk.black.bgRed(`Erro no Feature ${feature.name}:`) + chalk.red(` ${err}`));
            }
        });
    }
}

module.exports = featuresExport;


/* Types */
export type IFeature = {
    name: string,
	description: string,
	active: boolean,
	execute: (client: Discord.Client, config: IConfig, guild: Discord.Guild) => Promise<any>;
}