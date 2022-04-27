import { ApplicationCommandOptionChoice } from "discord.js";
import cache from "../database/cache";
import { ICommand } from "../handlers/commands";

export default <ICommand>{
    active: true,
    name: 'bot',
    description: 'Configura o bot, só pode ser usado pelo Criador.',
    forRoles: 'creator',
    guildOnly: false,
    options: [
        {
            name: 'exit',
            description: 'Termina o processo.',
            type: 'SUB_COMMAND',
        },
        {
            name: 'clean_cache',
            description: 'Limpa os dados do cache.json',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'category',
                    description: 'Categoria do cache que quer limpar',
                    type: 'STRING',
                    choices: getCategoriesOfDatabase(),
                    required: true
                }
            ]
        },
        // {
        //     name: 'script',
        //     description: 'Executa um script em JS',
        //     type: 'SUB_COMMAND',
        //     options: [
        //         {
        //             name: 'script',
        //             description: 'O script que quer executar',
        //             type: 'STRING',
        //         }
        //     ]
        // }
    ],
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        if(subCommand === 'exit') {
            await interaction.reply({ content: 'Process exited', ephemeral: true });
            process.exit(0);
        } else if(subCommand === 'clean_cache') {
            const categoryOfDatabase = <keyof typeof cache['data']>interaction.options.getString('category', true);

            let category: any = cache.data[categoryOfDatabase];

            if(typeof category !== 'object') return;

            if(Array.isArray(category)) {
                category.length = 0;
            } else {
                category = {};
            }

            cache.data[categoryOfDatabase] = category;

            await cache.write();

            interaction.reply({ content: `Cache ${categoryOfDatabase} cleaned`, ephemeral: true  });
        } else if(subCommand === 'script') {
            // const script = interaction.options.getString('script');
            
            // if(script) {
            //     try {
            //         const guild = interaction.guild; // for eval
            //         let result = await eval(`(async () => { ${script} })()`);
            //         if(typeof result === 'object') result = util.inspect(result, { depth: 0 });
    
            //         interaction.reply(`\`\`\`\n${result}\`\`\``);
            //     } catch (err) {
            //         interaction.reply(`\`\`\`\n${err}\`\`\``);
            //     }

            // } else {
            //     interaction.reply('Esperando script...');

            //     const filter = (m: Message) => m.author.id === interaction.user.id;
            //     const collector = await interaction.channel?.awaitMessages({ filter, max: 1, time: 1000 * 60, errors: ['time'] });
                
            //     const message = collector?.first();
                
            //     if(!message?.content) return;
            //     interaction.deleteReply();

            //     try {
            //         const guild = interaction.guild; // for eval
            //         let result = await eval(`(async () => { ${message.content} })()`);
            //         if(typeof result === 'object') result = util.inspect(result, { depth: 0 });
    
            //         message.reply(`\`\`\`\n${result}\`\`\``);
            //     } catch (err) {
            //         message.reply(`\`\`\`\n${err}\`\`\``);
            //     }
            // }   
        }
    }
}


/* Functions */
function getCategoriesOfDatabase() {
    const mappedCategories: ApplicationCommandOptionChoice[] = Object.keys(cache.data).map(category => {
        return { name: category, value: category };
    });

    return mappedCategories;
}