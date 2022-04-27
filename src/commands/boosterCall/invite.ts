import Discord from 'discord.js';
import { ifNotExistsChannelThrowError } from '.';
import { Embed } from '../../main';
import { ISubCommand } from "../../handlers/commands";

const subCommand: ISubCommand = async (interaction, voiceChannelOfUser: Discord.VoiceChannel) => {
    if(!ifNotExistsChannelThrowError(voiceChannelOfUser, interaction)) return;

    const member = <Discord.GuildMember>interaction.options.getMember('membro', true);

    await voiceChannelOfUser.permissionOverwrites.edit(member, {
        CONNECT: true,
        VIEW_CHANNEL: true
    });

    const invite = await voiceChannelOfUser.createInvite({ maxUses: 1 });

    member.send(`O usuário ${interaction.user.tag} está convidando você para se juntar ao canal de voz vip dele.\n\n${invite.url}`)
        .then(() => interaction.reply(Embed.create('Sucesso', 'Usuário Convidado')))
        .catch(() => interaction.reply(Embed.create('Aviso','A DM(Mensagem Direta) do usuário está fechada, as permissões foram concedidas para o usuário porém o convite não pode ser enviado.')));
}

export default subCommand;