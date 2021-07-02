import { GuildMember } from "discord.js";
import { IConfig } from "..";

function isStaffer(member: GuildMember | undefined, config: IConfig) {
    return new Promise<boolean>(terminated => {
        member?.roles.cache.forEach(role => {
            config.staffers.includes(role.id) && terminated(true);
        });

        terminated(false);
    });
}

export default isStaffer