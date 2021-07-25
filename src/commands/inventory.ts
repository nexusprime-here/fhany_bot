import { Message } from "discord.js";
import db from "../database";
import { Item } from "../features/seasonPass";

import embed from '../embeds/commands.inventory';

module.exports = {
    name: 'inventario',
    description: '',
    execute(message: Message, [...itemName]: string[]) {
        const foundUser: () => userInDatabase = () => db.get('users').find({ id: message.author.id }).value();

        if(!foundUser()) {
            db.get('users').push({ id: message.author.id, inventory: [], xp: 0 }).write();
        }

        if(itemName.join(' ').length > 0) {
            const itemEmbed = embed.seeItem();
            const selectedItem = foundUser().inventory.filter(item => item.name === itemName.join(' '))[0];

            itemEmbed
                .setTitle(selectedItem.name)
                .setFooter(selectedItem.rarity)
                .setImage(selectedItem.icon)

            message.channel.send(itemEmbed)
        } else {
            const inventoryEmbed = embed.seeInventory();
            foundUser().inventory.forEach(item => inventoryEmbed.addField(item.name, item.rarity, true));

            message.channel.send(inventoryEmbed);
        }
    }
}

interface userInDatabase {
    id: string;
    inventory: Item[];
}