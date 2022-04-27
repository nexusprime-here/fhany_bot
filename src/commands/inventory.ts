import User from "../database/models/User";
import { createCommand } from "../handlers/commands";
import { Embed } from "../main";

export default createCommand({
    active: false,
    name: "inventory",
    description: "Mostra seu dinheiro",
    forRoles: "everyone",
    guildOnly: true,
    async execute(interaction) {
        let foundUserOnDatabase = await User.findOne({ id: interaction.user.id });

        if(!foundUserOnDatabase) {
            await new User({
                id: interaction.user.id,
                money: 0
            }).save();

            foundUserOnDatabase = await User.findOne({ id: interaction.user.id });
        }

        interaction.reply(Embed.create('Info', {
            title: 'Inventário',
            description: `${foundUserOnDatabase?.money ? `Você possui ${foundUserOnDatabase.money}$` : 'Você não possui dinheiro'}`
        }));
    }
})