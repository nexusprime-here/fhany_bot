import fs from 'fs';
import Discord, { Client, Guild } from 'discord.js';
import { commands, IConfig, IHandler } from '..';

import embed from '../embeds/handlers.commands';
import chalk from 'chalk';

const commandFiles = fs.readdirSync('./dist/commands').filter(file => file.endsWith('.js'));

const commandsExport: IHandler = (client, config) => {
	console.log(chalk.black.bgBlueBright('\nLoading commands'));

	registerCommands(client, config);
    loadCommands();
	
    client.on('interactionCreate', interaction => {
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
    });
}

module.exports = commandsExport;


/* Functions */
function loadCommands() {
	console.log('foi')
	let lastCommandForLoad;
	
    for (const file of commandFiles) {
		console.log(`${chalk.blueBright('  |')} ${file} `)
		const command: ICommandWithPath = require(`../commands/${file}`);
		
        if(!command.active) continue;
		
        if(file === 'setting.js') {
			lastCommandForLoad = '../commands/setting.js';
            continue;
        }
		
        Object.assign(command, { path: () => require(`../commands/${file}`) })
		
        commands.set(command.name, command);
    }

    if(lastCommandForLoad) {
        lastCommandForLoad = require(lastCommandForLoad);
        commands.set(lastCommandForLoad.name, lastCommandForLoad);
    }
}
async function registerCommands(client: Client, config: IConfig) {
	console.log('registering')
	const guild = client.guilds.cache.get(config.guildId);
    if(!guild) return;

	await deleteAllUnregisteredCommands(guild);

	commands.forEach(async command => {
		try {
			if(!command.active) return;

			const everyone = guild.roles.everyone;

			const registeredCommand = await guild?.commands.create({
				name: command.name,
				description: command.description,
				options: command.options || []
			});
			
			if(command.permissions) {
				registeredCommand?.permissions.add({ permissions: command.permissions });
			}
			
			let blockCommandForEveryone: Discord.ApplicationCommandPermissionData | undefined;
			if(command.forRoles !== 'everyone') {
				blockCommandForEveryone = { id: everyone.id, type: 'ROLE', permission: false }
			}

			if(command.forRoles === 'booster') {
				const allBoostersRole: Discord.ApplicationCommandPermissionData[] = config.roles.boosters.otherRoles.map(role => {
					return { id: role, type: 'ROLE', permission: true }
				});
				allBoostersRole.push({ id: config.roles.boosters.role, type: 'ROLE', permission: true });

				blockCommandForEveryone && allBoostersRole.push(blockCommandForEveryone);
				
				registeredCommand?.permissions.add({ permissions: allBoostersRole });
			} 
			else if(command.forRoles === 'staff') {
				const allStaffersRole: Discord.ApplicationCommandPermissionData[] = config.roles.staffers.map(role => {
					return { id: role, type: 'ROLE', permission: true }
				});

				blockCommandForEveryone && allStaffersRole.push(blockCommandForEveryone);
				
				registeredCommand?.permissions.add({ permissions: allStaffersRole });
			} 
			else if(command.forRoles === 'adm') {
				const allAdmsRole: Discord.ApplicationCommandPermissionData[] = config.roles.adms.map(role => {
					return { id: role, type: 'ROLE', permission: true }
				});

				blockCommandForEveryone && allAdmsRole.push(blockCommandForEveryone);
				
				registeredCommand?.permissions.add({ permissions: allAdmsRole });
			}
		} catch (err) {
			console.error(chalk.black.bgRed(`Erro no comando ${command.name}:`) + ' ' + chalk.red(err));
		}
	});
}
async function deleteAllUnregisteredCommands(guild: Guild | undefined) {
    (await guild?.commands.fetch())?.forEach(async command => {
        if(!commands.get(command.name) || !commands.get(command.name)?.active) 
			await command.delete();
    });
}

/* Types */
export type ICommand = {
    active: boolean;
	name: string,
	description: string,
	options?: Discord.ApplicationCommandOptionData[],
	guildOnly: boolean,
	permissions?: Discord.ApplicationCommandPermissionData[],
    forRoles: 'booster' | 'staff' | 'adm' | 'everyone',
	execute: (interaction: Discord.CommandInteraction, config: IConfig) => void
}
export interface ICommandWithPath extends ICommand { path: () => any }