// Importing modules
import dotenv from 'dotenv';
import chalk from 'chalk';
import Discord from 'discord.js'; 
import fs from 'fs'; 
import nodeEvents from 'events';
import EasyEmbed from 'discord.js-easy-embed';
import path from 'path';

// Importing files
// import './database';
import './database/ids';
import './database/cache';
import { ICommand } from './handlers/commands';
import { IEvent } from './handlers/events';
import { IFeature } from './handlers/features';
import { name, version } from '../package.json';

console.log(chalk.inverse(`Starting ${name}@${version} \n`));

dotenv.config({ path: path.resolve(process.cwd(), 'src', 'settings.env') });

export const client = <ModifiedClient>new Discord.Client({ intents: [
	'GUILD_MESSAGES',
	'DIRECT_MESSAGE_REACTIONS',
	'DIRECT_MESSAGE_TYPING',
	'GUILDS',
	'GUILD_VOICE_STATES',
	'GUILD_MEMBERS',
	'GUILD_PRESENCES',
]});

client.commands = new Discord.Collection();
client.events 	= new Discord.Collection();
client.features = new Discord.Collection();

export const seasonPass = new class extends nodeEvents {}

client.once('ready', async () => {
	const handlerFiles = fs.readdirSync(path.join(__dirname, 'handlers'));
	
	for (const filePath of handlerFiles) {
		const file: IHandler = (await import(`./handlers/${filePath}`)).default;

		try {
			await file(client);
		} catch (err) {
			console.error(`Erro no Handler ${filePath.split('.')[0]}:`);
			console.error(err);

			process.exit(0);
		}
	}
	
	console.log(chalk.black.bgGreen('\nReady!'));
});

client.login(process.env.TOKEN);

const footer = { text: `</Nexus_Prime>  |  v${version}` }
export const Embed = new EasyEmbed({
	ephemeral: true,
	separator: ' | ',
	types: [
		{
			name: 'Sucesso',
			color: '#69b84f',
			emoji: '✅',
			footer
		},
		{
			name: 'Erro',
			color: '#ba2d42',
			emoji: '❌',
			footer
		},
		{
			name: 'Aviso',
			color: '#ffd336',
			emoji: '⚠️',
			footer
		},
		{
			name: 'Info',
			color: '#478eba',
			footer
		}
	]
});


/* Types */
export type IHandler = (client: ModifiedClient) => Promise<void>;

export interface ModifiedClient extends Discord.Client {
	commands: Discord.Collection<string, ICommand>;
	events: Discord.Collection<string, IEvent>;
	features: Discord.Collection<string, IFeature>;
} 