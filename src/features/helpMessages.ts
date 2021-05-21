import { Client, Message } from "discord.js";
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
        `Temos cineminhas todos os sábados, caso queira ser notificado dos nossos filmes, vá no <#750621518328758414> e ative o cargo "avisos de eventos".`,
        `Você pode adicionar cargos sobre seu gênero, sexualidade e idade no <#750621518328758414>.`,
        'Ei, você poderia nos avaliar? Vá até o <#842394568284307456> para fazer isso. É muito importante para nós.. 👉👈'
    ];

    const messagesCache: string[] = [];

    client.on('message', message => {
        if(!config.chats.includes(message.channel.id)) return;
        
        messagesCache.push(message.content);
        if(messagesCache.length <= 30) return;
        
        message.channel.send(`Dica: ${allMessages[Math.floor(Math.random() * allMessages.length)]}`);
        messagesCache.length = 0;
    });

}