"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: 'helpMessages',
    description: 'Envia dicas aleatórias no chat.',
    execute: execute
};
function execute(client, config) {
    var allMessages = [
        "Voc\u00EA sabia que caso ache injusto alguma puni\u00E7\u00E3o sua, voc\u00EA pode constatar a staff no <#835612037954273300> e reclamar.",
        "Seja booster agora! Quer saber as vantagens? Visite <#797930500231790633>.",
        'Não mande links aqui!',
        'Não tente enviar gifs, vídeos ou imagens aqui se você não for booster!',
        "Temos o <#811768172079218729> para spawnar canais de voz para voc\u00EA encontrar parceiros para jogos!",
        'Não marque a fhany caso ela não esteja ativa no chat, eu avisarei se ela estiver.',
        "Se voc\u00EA ver algum membro fazendo algo que v\u00E1 contra as <#745049777791565915>, Denuncie no canal <#745062559500992512>.",
        "Temos cineminhas todos os s\u00E1bados, caso queira ser notificado dos nossos filmes, v\u00E1 no <#750621518328758414> e ative o cargo \"avisos de eventos\".",
        "Voc\u00EA pode adicionar cargos sobre seu g\u00EAnero, sexualidade e idade no <#750621518328758414>."
    ];
    var messagesCache = [];
    client.on('message', function (message) {
        if (!config.chats.includes(message.channel.id))
            return;
        messagesCache.push(message.content);
        if (messagesCache.length <= 30)
            return;
        message.channel.send("Dica: " + allMessages[Math.floor(Math.random() * allMessages.length)]);
        messagesCache.length = 0;
    });
}
