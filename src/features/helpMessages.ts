import { Client, Message, MessageEmbed } from "discord.js";
import { IConfig } from "..";

module.exports = {
    name: 'helpMessages',
    description: 'Envia dicas aleatórias no chat.',
    execute
}

function execute(client: Client, config: IConfig) {
    const allMessages = [
        `Você sabia que caso ache injusto alguma punição sua, você pode constatar a staff no <#835612037954273300> e reclamar?`,
        `Seja booster agora! Quer saber as vantagens? Visite <#797930500231790633>.`,
        'Não mande links aqui!',
        'Não tente enviar gifs, vídeos ou imagens aqui se você não for booster!',
        `Temos o <#811768172079218729> para spawnar canais de voz para você encontrar parceiros para jogos!`,
        'Não marque a fhany caso ela não esteja ativa no chat, eu avisarei se ela estiver.',
        `Se você ver algum membro fazendo algo que vá contra as <#745049777791565915>, Denuncie no canal <#745062559500992512>.`, 
        `Temos cineminhas todos os sábados..".`,
        `Você pode adicionar cargos sobre seu gênero, sexualidade e idade no <#750621518328758414>.`,
        'Ei, você poderia nos avaliar? Vá até o <#842394568284307456> para fazer isso. É muito importante para nós.. 👉👈',
        ':3',
    ];

    const messagesCache: string[] = [];
    let selectedMessages: string[] = [ ...allMessages];

    client.on('message', message => {
        if(!config.chats.includes(message.channel.id)) return;
        
        messagesCache.push(message.content);
        if(messagesCache.length <=  100) return;

        const selected = selectedMessages[Math.floor(Math.random() * selectedMessages.length)];
        selectedMessages.splice(selectedMessages.indexOf(selected), 1);


        if(selectedMessages.length === 0) {
            selectedMessages = [...allMessages];
        }

        const embed = new MessageEmbed()
            .setTitle('Dica')
            .setDescription(selected)
            .setFooter('Copyright © Fhany | Created by: </Nexus_Prime>')
            .setColor('#F55EB3');

        message.channel.send(embed);
        messagesCache.length = 0;
    });

}