import { GuildMember } from "discord.js";
import idCache, { IdTypes } from "../database/ids";

function isStaffer(member: GuildMember | undefined): Promise<boolean> {
    return new Promise<boolean>(terminated => {
        member?.roles.cache.forEach(async role => {
            const roles = await idCache.get('roles');
            roles?.staffers.includes(role.id) && terminated(true);
        });

        terminated(false);
    });
}

export default isStaffer
