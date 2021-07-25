import { Client, GuildMember } from "discord.js";
import { IConfig, seasonPass } from "..";
import db from "../database";

import embed from '../embeds/features.seasonPass';

module.exports = {
    name: 'temporaryPass',
    description: '',
    execute(client: Client, config: IConfig) {
        const allItems = {
            oculos: new Item(
                'Oculos irado da Fhany', 
                'https://cdn.discordapp.com/attachments/860698912212779019/861722894727249931/Background.png',
                'legendary'
            ),
        }

        // se a cada 1 hora ela mandasse 50 mensagens, ela manda 100 msg por dia ficando 2 hrs no chat
        // durante uma semana (7 dias) ela pegaria 700 de xp, sendo cada mensagem 1 de xp
        const collectedLevelsCache: Array<number> = [];
        const acceptedLevels: any = {
            10: () => console.log('Alcançou 10 de xp'),
            40: (userId: string) => addItem(allItems.oculos, userId),
            70: () => console.log('alcançou 70 de xp'),
            100: () => console.log('alcançou 100 de xp'),
            130: () => console.log('alcançou 130 de xp'),
            160: () => console.log('alcançou 160 de xp'),
            190: () => console.log('alcançou 190 de xp'),
            220: () => console.log('alcançou 220 de xp'),
        }

        seasonPass.on('xpUpdate', (member: GuildMember, xp: number) => {
            const newXp = saveXpOnDatabase(member.id, xp);

            const isLeveledUp = tryLevelUp(acceptedLevels, newXp, member.id, collectedLevelsCache);

            isLeveledUp && sendMessageOfLevelUp(member);
        });
    }
}


/* Functions */
const findUser = (userId: string) => db.get('users').find({ id: userId });

function sendMessageOfLevelUp(member: GuildMember) {
    member.send(embed.memberLeveledUp(true, member.id)).catch(() => {
        const lastMessageOfUser = member.lastMessageChannelID;

        if(!lastMessageOfUser) return;

        const channelOfLastMessage = member.guild.channels.cache.get(lastMessageOfUser);
        channelOfLastMessage?.isText() && channelOfLastMessage.send(embed.memberLeveledUp(false, member.id));
    })
}

function verifyIfItemHasBeenCollected(collectedLevels: Array<number>, level: number) {
    const isCollected = collectedLevels.includes(level);

    if(!isCollected) collectedLevels.push(level);

    return !isCollected;
}

function saveXpOnDatabase(userId: string, newXp: number) {
    if(!findUser(userId).value()) {
        db.get('users').push({ id: userId, inventory: [], xp: 0 }).write();
    }

    const oldXp = findUser(userId).value().xp;
    findUser(userId).assign({ xp: oldXp + newXp }).write();

    return findUser(userId).value().xp;
}

function tryLevelUp(levels: any, userXp: number, userId: string, collected: Array<number>) {
    let isLeveledUp: boolean = false;
    Object.keys(levels).forEach((key, index, arr) => {
        if(userXp < parseInt(key)) return;

        if(!arr[index + 1]) return levels[parseInt(key)]();

        if(userXp >= parseInt(arr[index + 1])) return;

        verifyIfItemHasBeenCollected(collected, parseInt(key)) && (isLeveledUp = true) && levels[parseInt(key)](userId);
    });

    return isLeveledUp;
}

function addItem(item: Item, userId: string) {
    db.get('users').find({ id: userId }).get('inventory').push(item).write();
}

export class Item {
    public name: string;
    public icon: string;
    public rarity: string;

    constructor(name: string, icon: string, rarity: 'common' | 'uncommon' | 'rare' | 'legendary') {
        this.name = name;
        this.icon = icon;
        this.rarity = rarity;
    }
}