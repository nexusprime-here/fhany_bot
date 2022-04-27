import { Embed } from "../../main";
import idCache from "../../database/ids";
import { createFeature } from "../../handlers/features";

export default createFeature({
    active: true,
    name: 'tips',
    description: 'Envia dicas aleatórias no chat.',
    async execute(guild) {
        const allMessages = [
            `Você sabia que caso ache injusto alguma punição sua, você pode constatar a staff no <#855579164576186368> e reclamar?`,
            `Seja booster agora! Quer saber as vantagens? Visite <#797930500231790633>.`,
            'Não mande links aqui!',
            'Não tente enviar gifs, vídeos ou imagens aqui se você não for booster!',
            `Temos o <#811768172079218729> para spawnar canais de voz para você encontrar parceiros para jogos!`,
            `Se você ver algum membro fazendo algo que vá contra as <#745049777791565915>, denuncie no canal <#855569272453726278>.`, 
            `Se você ver algum staffer abusando do poder, denuncie no canal <#855569272453726278>.`,
            `Você pode adicionar cargos sobre seu gênero, sexualidade e idade no <#750621518328758414>.`,
            'Ei, você poderia nos avaliar? Vá até o <#842394568284307456> para fazer isso. É muito importante para nós.. 👉👈',
            'Não mande textos repetidos!',
            'NÃO GRITE DEMAIS!!',
            'Para ver todos os cargos disponíveis no server e suas funções, visite <#781341316420075530>.',
            'Tem uma sugestão para o server? Deixe seu comentário no <#812513954727067728>.',
            'Há uma atualização para mim muito importante em breve, eu vou ter passe de temporada?!',
            'Respeite os Animadores, Moderadores, e Administradores. Eles se esforçam muito para cuidar da nossa comunidade. \n\n||A Fhany você pode mandar ir se ferrar mesmo||',
            'Que tal testar seu QI com partida de xadrez em <#859283258013777950>? ♟',
            'Hey, psiu.. otaku! Temos o bot mudae aqui também, de uma olhada no <#860570506424221748>.',
            'Você curte Pokémon? Talvez devesse dar uma olhada em <#842533556269875271>.',
            'Hmmm, de acordo com minha bola de cristal, você irá ler esta mensagem. \n\nMinha bola de cristal também diz que você irá passar no canal <#839538613586755664>!',
            'Quer tentar adivinhar desenhos impossíveis de ser adivinhados e passar raiva quando perder? Da uma passadinha no <#753636957967614105>.',
            'Use os comandos dos bots em <#750815469241368609>, a menos que seja um bot de mini game.',
            'Você pode divulgar seu canal e seu vídeo em <#745087883781603428>. \n\n**Não divulgue links de servidor lá e nem nenhum outro canal deste servidor!**',
            'Mostre ao mundo suas obras de arte! Visite <#751043978065084506>.'
        ];
    
        const messagesCache: string[] = [];
        let selectedMessages: string[] = [...allMessages];
    
        guild.client.on('messageCreate', async message => {
            const talkChannels = (await idCache.get('channels'))?.talk;
            if(!talkChannels?.includes(message.channel.id)) return;
            
            messagesCache.push(message.content);
            if(messagesCache.length <= 120) return;
    
            const selected = selectedMessages[Math.floor(Math.random() * selectedMessages.length)];
            selectedMessages.splice(selectedMessages.indexOf(selected), 1);
    
            if(selectedMessages.length === 0) {
                selectedMessages = [...allMessages];
            }
    
            message.channel.send(Embed.create('Info', {
                title: 'Dica',
                description: selected
            }));

            messagesCache.length = 0;
        });
    }
})