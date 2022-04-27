import fs from 'fs';
import Discord from 'discord.js';
import { Embed, IHandler } from '../main';
import chalk from 'chalk';
import idCache from '../database/ids';
import path from 'path';

const commandFiles = fs.readdirSync(path.join(process.cwd(), 'src', 'commands'));

export function createCommand(e: ICommand): ICommand {
    return e;
}

const commands: IHandler = async client => {
	console.log(chalk.black.bgBlueBright('\nLoading commands'));
	
    for await (const file of commandFiles) {
		const command: ICommand = (await import(`../commands/${file}`)).default;

        if(!command.active) continue;
        client.commands.set(command.name, command);

		console.log(`${chalk.blueBright('  |')} ${command.name} `)
    }

	const guild = <Discord.Guild>client.guilds.cache.get(<string>await idCache.get('guildId'));

	const roles = await idCache.get('roles');
	if(!roles) return pushErrorInAllInteractions();

	await deleteAllUnregisteredCommands();

	client.commands.forEach(async command => {
		if(!command.active) return;

		const registeredCommand = await guild?.commands.create({
			name: command.name,
			description: command.description,
			options: command.options ?? []
		});

		setPermissions(command, registeredCommand, roles);
	});
	
    client.on('interactionCreate', async interaction => {
		if(!interaction.isCommand()) return;
		
        const command = <ICommand>client.commands.get(interaction.commandName);
        
        try {
			await command.execute(interaction);
        } catch (err) {
			console.error(chalk.black.bgRed(`Erro no Comando ${command.name}:`));
            console.error(err);

            interaction.reply('Ocorreu um erro ao executar o comando.');
        };
    });


	/* Functions */
	function pushErrorInAllInteractions() {
		client.on('interactionCreate', async interaction => {
			if(!interaction.isCommand()) return;
			
			if(interaction.commandName !== 'bot') return interaction.reply(Embed.create('Erro', {
				title: 'Comandos não disponíveis',
				description: 'Ocorreu um erro ao carregar os comandos. Tente novamente mais tarde. \n\nErro: `Ids de cargos não encontrados`'
			}));

			client.commands.get('bot')?.execute(interaction);
		});
	}
	async function deleteAllUnregisteredCommands() {
		(await guild.commands.fetch())?.forEach(async command => {
			if(!client.commands.get(command.name) || !client.commands.get(command.name)?.active)
				await command.delete();
		});
	}
	function setPermissions(command: ICommand, commandAplication:  Discord.ApplicationCommand, idRoles: Exclude<typeof roles, undefined>) {
		const everyone = guild.roles.everyone;

		const allRoles: Discord.ApplicationCommandPermissionData[] = [];

		if(command.forRoles === 'everyone') {
			allRoles.push({ id: everyone.id, type: 'ROLE', permission: true });
		} else {
			allRoles.push({ id: everyone.id, type: 'ROLE', permission: false });
		}

		switch (command.forRoles) {
			case 'booster':
				allRoles.push({
					id: idRoles.booster,
					type: 'ROLE',
					permission: true
				});
				allRoles.push({
					id: idRoles.vip,
					type: 'ROLE',
					permission: true
				});
				
				break;
			case 'staff':
				idRoles.staffers.forEach(roleId => {
					allRoles.push({
						id: roleId,
						type: 'ROLE',
						permission: true
					});
				});

				break;
			case 'adm':
				idRoles.adms.forEach(roleId => {
					allRoles.push({
						id: roleId,
						type: 'ROLE',
						permission: true
					});
				});

				break;
			case 'creator':
				allRoles.push({
					id: '607999934725357578',
					type: 'USER',
					permission: true
				});
				
				break;
		}

		commandAplication.permissions.add({ permissions: allRoles });
	}
}

export default commands;


/* Types */
export type ICommand = {
    active: boolean;
	name: string,
	description: string,
	options?: Discord.ApplicationCommandOptionData[],
	guildOnly: boolean,
	permissions?: Discord.ApplicationCommandPermissionData[],
    forRoles: 'booster' | 'staff' | 'adm' | 'everyone' | 'creator',
	execute: (interaction: Discord.CommandInteraction) => Promise<any>
}
export type ISubCommand = (interaction: Discord.CommandInteraction, ...args: any) => Promise<any>