import Discord, { Client, Message, MessageEmbed } from 'discord.js';
import fs from 'fs';
import embed from './embeds/src.index';

const configPath = process.argv[2] === 'test' ? './config/configtest.json' : './config/config.json';
const config: IConfig = require(configPath);

export const client = new Discord.Client({ partials: ['REACTION'] });

export const commands: Commands = new Discord.Collection();
const cooldowns: Cooldowns = new Discord.Collection();

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
	startFeatures(client)

	console.log('O bot foi iniciado com sucesso!');
});

function startFeatures(client: Client) {
	fs.readdir('dist/features', (_, files) => {
		try {
			files.forEach(file => {
				const filePath = require(`./features/${file}`);
	
				filePath.execute(client, config);
			});
		} catch (err) {
			console.log(err);

			process.exit(0);
		}
	});
};

client.on('message', async message => {
	if (!message.content.startsWith(config.prefix) || message.author.bot) return;

	const args = message.content.slice(config.prefix.length).split(/ +/);
	const commandName = args.shift()?.toLowerCase();

	if(!commandName) return;

	const command = commands.get(commandName);

	if (!command) return;

	if(command.booster) {
		const member = message.guild?.members.cache.get(message.author.id);

		if(!hasPermission(config.booster.roles)) 
			return message.reply(embed.notBooster) 


		function hasPermission(permittedRoles: string[]) {
			let result: boolean = false;
			member?.roles.cache.forEach(role => {
				permittedRoles.forEach(role2 => {
					role.id === role2 && (result = true);
				})
			});

			return result;
		}
	}
	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply(embed.notDM);
	};


	if (command.permissions) {
		if(message.channel.type !== 'text') return;
		if(!message.client.user) return;

		const authorPerms = message.channel.permissionsFor(message.client.user);
		if (!authorPerms || !authorPerms.has(command.permissions)) return;
	};

	if(command.roles) {
		const roles = message.guild?.members.cache.get(message.author.id)?.roles.cache

		let findRole;
		command.roles.forEach(role => {
			findRole = roles?.has(role);
		})

		if(!findRole) return message.reply(embed.missingRole(command.roles))
	}

	if (command.args && !args.length) {
		let reply = embed.missingArgs;

		if (command.usage) {
			reply = embed.missingArgs.setDescription(`O jeito correto seria: \`${config.prefix}${command.name} ${command.usage}\``);
		};

		return message.channel.send(reply);
	};

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	};

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
		
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(embed.timeNotExpired(timeLeft.toFixed(1), commandName));
		};
	};
	
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	
	try {
		command.execute(message, args, client, config);
	} catch (error) {
		console.error(error);
		message.reply(embed.commandNotWork);
	};
});

client.login(config.token);


/* Types */
export type Commands = Map<string, {
	name: string,
	description: string,
	args?: boolean,
	guildOnly?: boolean,
	permissions?: [],
	roles?: string[],
	booster?: boolean,
	usage?: string,
	cooldown?: number,
	execute: (message: Message, args: string[], client: Client, config: IConfig | any) => void
}>

type Cooldowns = Map<string, any>;

export type IConfig = {
	token: string,
	prefix: string,
	guild: string,
	chats: string[],
	staffers: string[],
	fhanyPresenceDetector: {
		fhany: string,
		roles: {
			silence: string
		},
	},

	booster: {
		roles: string[],
		category: string
	}

	temporaryCalls: {
		normal: {
			controllerChannel: string,
			category: string
		},
		games: {
			controllerChannel: string,
			category: string
		},
		roles: {
			booster: string,
			vip: string
		}
	},
	suggestion: {
		channel: string,
		permittedRoles: string[]
	},
	reminder: {
		postChannel: string
	}
}