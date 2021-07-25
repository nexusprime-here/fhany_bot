import { GuildMember, MessageEmbed } from "discord.js";
import { globalError, globalSucess } from "./global";


export default {
    sucess: (value: number, sender: GuildMember | undefined, receiver: GuildMember) => globalSucess()
        .setDescription(`O ${sender?.user.username} adicionou ${value}xp em ${receiver.user.username}!`),

    invalidXp: globalError()
        .setDescription('Por favor defina o valor de xp.'),

    hasNotReceiver: globalError()
        .setDescription('Mencione a pessoa que irá receber o xp.'),
    
    memberNotFound: globalError()
        .setDescription('Membro não encrontrado!')
}