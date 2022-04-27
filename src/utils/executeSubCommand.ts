import { CommandInteraction } from "discord.js";

export default async function executeSubCommand(file: string, interaction: CommandInteraction, ...args: any[]) {
    return (await import(`./${file}`)).default(interaction, ...args);
}