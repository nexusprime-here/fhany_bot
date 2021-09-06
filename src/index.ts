import chalk from 'chalk';
const { name, version } = require('../package.json');

console.log(chalk.inverse(`Starting ${name}@${version} \n`));

import Discord from 'discord.js'; 
import fs from 'fs'; 
import nodeEvents from 'events'; 

import { ICommand, ICommandWithPath } from './handlers/commands';
import { IEvent } from './handlers/events';
import { IFeature } from './handlers/features';

const configPath = process.argv[2] === 'test' ? './config/configTest' : './config/config';
const config: IConfig = require(configPath).default;

const FLAGS = Discord.Intents.FLAGS;
export const client = new Discord.Client({ intents: [
	FLAGS.GUILD_MESSAGES,
	FLAGS.DIRECT_MESSAGE_REACTIONS,
	FLAGS.DIRECT_MESSAGE_TYPING,
	FLAGS.GUILDS,
	FLAGS.GUILD_VOICE_STATES,
	FLAGS.GUILD_MEMBERS,
	FLAGS.GUILD_PRESENCES
]});

export const seasonPass = new class extends nodeEvents {}

export const features: Map<string, IFeature> = new Discord.Collection();
export const events: Map<string, IEvent> = new Discord.Collection();
export const commands: Map<string, ICommand | ICommandWithPath> = new Discord.Collection();

client.once('ready', async () => {
	fs.readdirSync('./dist/handlers').forEach(filePath => {
		const file: IHandler = require(`./handlers/${filePath}`);
	
		try {
			file(client, config);
		} catch (err) {
			console.error(`Erro no Handler ${filePath.split('.')[0]}: ${err}`);

			process.exit();
		}
	});
	
	console.log(chalk.black.bgGreen('\nReady!'));
});


client.login(config.token);


/* Types */
export type IHandler = (client: Discord.Client, config: IConfig) => void

export type IConfig = {
	token: string
	guildId: string

	roles: {
		boosters: {
			role: string,
			otherRoles: string[]
		}
		staffers: string[]
		adms: string[]
		muted: string
	}

	channels: {
		talk: string[]
		trend: string
		suggestion: string
	}

	commands: {
		boosterCall: {
			category: string
		},

		sendNotice: {
			admChannel: string
			noticeChannel: string
		}
	}

	features: {
		trends: {

		}

		temporaryCalls: {
			controllerChannel: string
			category: string
		}
	}
}
