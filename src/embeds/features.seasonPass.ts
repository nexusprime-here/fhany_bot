import { globalCommon } from "./global";

export default {
    memberLeveledUp: (isDM: boolean, userId: string, collectedItemName?: string) => globalCommon()
        .setTitle('Subiu de nível')
        .setDescription(`${isDM 
            ? 'Você subiu de nível no passe de temporada!' 
            : `O membro <@${userId}> subiu de nível no passe de temporada!`
        } \n\n${collectedItemName 
            ? isDM 
                ? `Você desbloqueou o item ${collectedItemName}.`
                : `<@${userId}> desbloqueou o item ${collectedItemName}.`
            : ''
        }`)
}