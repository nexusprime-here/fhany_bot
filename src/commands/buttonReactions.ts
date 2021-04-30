import { Message, MessageEmbed } from "discord.js";

module.exports = {
    name: 'buttonreactions',
    description: '',
    args: true,
    
    execute(message: Message, args: string[]) {
        const embeds = createEmbeds();
        
        if(args[0] === 'normal' && message.author.id === '607999934725357578') 
            message.channel.send(embeds[1]).then(msg => {
                msg.react('🎧');
                msg.react('🔒');
                msg.react('🔹');
                msg.react('🎇');
            });
        
        if(args[0] === 'games' && message.author.id === '607999934725357578')
            message.channel.send(embeds[2]).then(msg => {
                msg.react('🔮');
                msg.react('🛸');
                msg.react('🔪');
                msg.react('🏹');
                msg.react('👹');
                msg.react('🔫');
                msg.react('🧊');
                msg.react('💣');
                msg.react('🚓');
                msg.react('🚗');
                msg.react('🏉');
                msg.react('♟');
                msg.react('❓');
            });
    }
}

function createEmbeds() {
    return {
        1: new MessageEmbed()
            .setTitle('Button Reactions 🤯')
            .setDescription('Clique em um emoji abaixo para spawnar um canal de voz, quando todos sairem ele será apagado. Por favor, utilize os canais como foram feitos para ser usados')
            .setColor('#F55EB3')
            .addFields([
                {
                    name: 'Call Comum',
                    value: '🎧',
                    inline: false
                },
                {
                    name: 'Call Privado',
                    value: '🔒',
                    inline: false
                },
                {
                    name: 'Call Booster',
                    value: '🔹',
                    inline: false
                },
                {
                    name: 'Bordel Vip',
                    value: '🎇',
                    inline: false
                }
            ]),
        
        2: new MessageEmbed()
            .setTitle('Button Reaction para Games!')
            .setDescription('Clique em um emoji abaixo para spawnar um canal de voz, quando todos sairem ele será apagado. Por favor, utilize os canais como foram feitos para ser usados')
            .setColor('#F55EB3')
            .addFields([
                {
                    name: 'LoL',
                    value: '🔮',
                    inline: true
                },
                {
                    name: 'Among Us',
                    value: '🛸',
                    inline: true
                },
                {
                    name: 'Brawlhala',
                    value: '🔪',
                    inline: true
                },
                {
                    name: 'Genshin',
                    value: '🏹',
                    inline: true
                },
                {
                    name: 'Erebus/RPG',
                    value: '👹',
                    inline: true
                },
                {
                    name: 'CoD',
                    value: '🔫',
                    inline: true
                },
                {
                    name: 'Minecraft',
                    value: '🧊',
                    inline: true
                },
                {
                    name: 'Valorant',
                    value: '💣',
                    inline: true
                },
                {
                    name: 'GTA Online',
                    value: '🚓',
                    inline: true
                },
                {
                    name: 'Rocket League',
                    value: '🚗',
                    inline: true
                },
                {
                    name: 'Esportes',
                    value: '🏉',
                    inline: true
                },
                {
                    name: 'Xadrez/Damas',
                    value: '♟',
                    inline: true
                },
                {
                    name: 'Outros',
                    value: '❓',
                    inline: true
                },
            ])
    }
}