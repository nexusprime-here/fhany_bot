import { GuildMember, User } from "discord.js";
import { globalCommon, globalError, globalWarn } from "./global";

export default {
    wantTrade: (member: User) => globalCommon()
        .setDescription(`O membro <@${member.id}> quer trocar com você. \n\nVocê aceita iniciar uma troca?`),

    tradeReject: globalWarn()
        .setDescription('O usuário rejeitou a troca!'),

    timeIsOver: globalError()
        .setDescription('O tempo para responder acabou!')
}