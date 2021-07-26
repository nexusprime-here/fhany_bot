import Discord from 'discord.js'; import fs from 'fs'; import events from 'events';

import './config/config.json'; import './config/configtest.json'; // This imports is for the tsc compile all configs

import embed from './embeds/src.index';

const configPath = process.argv[2] === 'test' ? './config/configtest.json' : './config/config.json';
const config: IConfig = require(configPath);

const intents = new Discord.Intents().add('GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'GUILD_MESSAGE_TYPING', 'GUILDS', 'GUILD_VOICE_STATES')
export const client = new Discord.Client({ intents: intents });

export const commands: Commands = new Discord.Collection();

export const seasonPass = new class extends events {}

const commandFiles = fs.readdirSync('./dist/commands').filter((file: string) => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./dist/events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	commands.set(command.name, command);
};
for (const file of eventFiles) {
	const event = require(`./events/${file}`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client, config));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client, config));
	}
}

client.on('ready', async () => {
	startFeatures();
	loadCommands();
	
	console.log('O bot foi iniciado com sucesso!');
});


client.on('interaction', interaction => {
	if(!interaction.isCommand()) return;

	const command = commands.get(interaction.commandName);
	
	if(!command) return interaction.reply({ embeds: [] });
	
	if(command.guildOnly && interaction.channel?.type === 'DM') {
		return interaction.reply({ embeds: [] });
	}
	
	try {
		command?.execute(interaction, config);
	} catch (error) {
		console.error(error);
		interaction.reply({ embeds: [embed.commandNotWork] });
	};
})

client.login(config.token);


/* Functions */
function loadCommands() {
	const guild = client.guilds.cache.get(config.guild);

	guild?.commands.create({
		name: 'oi',
		description: 'oi',
	})

	commands.forEach(async command => {
		if(command.name !== "criarcanal") return
		
		// console.log(command)
		const registeredCommand = await guild?.commands.create({
			name: command.name,
			description: command.description,
			options: command.options
		});
		
		if(command.permissions) {
			registeredCommand?.permissions.add({ permissions: command.permissions });
		}
		
		if(command.booster) {
			const allBoosters: Discord.ApplicationCommandPermissionData[] = config.booster.roles.map(role => {
				return { id: role, type: 'ROLE', permission: true }
			});
			
			registeredCommand?.permissions.add({ permissions: allBoosters });
		}
	});
}
function startFeatures() {
	fs.readdir('dist/features', (_, files) => {
		try {
			files.forEach(file => {
				const filePath = require(`./features/${file}`);
	
				filePath?.execute(client, config);
			});
		} catch (err) {
			console.log(err);

			process.exit();
		}
	});
};


/* Types */
export type Commands = Map<string, Command>
export type Command = {
	name: string,
	description: string,
	options: Discord.ApplicationCommandOptionData[],
	guildOnly?: boolean,
	permissions?: Discord.ApplicationCommandPermissionData[],
	booster?: boolean,
	execute: (message: Discord.CommandInteraction, config: IConfig | any) => void
}

type Cooldowns = Map<string, any>;

export type IConfig = {
	token: string,
	prefix: string,
	guild: `${bigint}`,
	chats: Array<`${bigint}`>
	staffers: `${bigint}`[],
	fhanyPresenceDetector: {
		fhany: `${bigint}`,
		roles: {
			silence: `${bigint}`
		},
		blackListChannels: Array<`${bigint}`>,
		whiteListChannels: Array<`${bigint}`>
	},
	programmer: `${bigint}`;

	booster: {
		roles: `${bigint}`[],
		category: `${bigint}`
	}

	sendNotice: {
		admChannel: `${bigint}`,
		noticeChannel: `${bigint}`
	}

	temporaryCalls: {
		controllerChannel: `${bigint}`,
		category: `${bigint}`,
		roles: {
			booster: `${bigint}`,
			vip: `${bigint}`
		}
	},
	suggestion: {
		channel: `${bigint}`,
		permittedRoles: `${bigint}`[]
	},
	reminder: {
		postChannel: `${bigint}`
	}
}