import { Client, Message } from "discord.js";
import { config } from "node:process";
import { IConfig, seasonPass } from "..";

module.exports = {
    name: 'message', 
    execute(message: Message, client: Client, config: IConfig) {
        if(!config.chats.includes(message.channel.id)) return;
        if(message.author.bot) return;
        
        seasonPass.emit('xpUpdate', message.member, 1);
    }
}