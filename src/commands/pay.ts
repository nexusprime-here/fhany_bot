import { ButtonInteraction, CacheType, MessageActionRow, MessageButton } from "discord.js";
import User from "../database/models/User";
import { createCommand } from "../handlers/commands";
import { Embed } from "../main";

export default createCommand({
    active: false,
    name: "pay",
    description: "Paga alguém",
    forRoles: "everyone",
    guildOnly: true,
    options: [
        {
            name: 'destinatário',
            description: 'O usuário que você quer pagar',
            type: 'USER',
            required: true
        },
        {
            name: 'quantia',
            description: 'A quantia que você quer pagar',
            type: 'NUMBER',
            required: true
        }
    ],
    async execute(interaction) {
        const quantity = interaction.options.getNumber('quantia', true);
        const receiverUser = interaction.options.getUser('destinatário', true);

        const database = {
            sender: await async function() {
                let databaseUser = await User.findOne({ id: interaction.user.id });

                if(!databaseUser) databaseUser = await new User({
                    id: interaction.user.id,
                    money: 0
                }).save();

                return databaseUser;
            }(),
            receiver: await async function() {
                let databaseUser = await User.findOne({ id: receiverUser.id });

                if(!databaseUser) databaseUser = await new User({
                    id: receiverUser.id,
                    money: 0
                }).save();

                return databaseUser;
            }()
        }

        if(database.sender.money < quantity) return interaction.reply(Embed.create('Erro', {
            title: 'Dinheiro insuficiente',
            description: 'Você não possui dinheiro suficiente para pagar'
        }));

        if(database.sender.id === database.receiver.id) return interaction.reply(Embed.create('Erro', {
            title: 'Erro',
            description: 'Você não pode pagar a si mesmo bobinho!'
        }));


        await interaction.reply(Embed.create('Info', {
            title: 'Confirmação de Pagamento',
            description: `Você está prestes a pagar para ${receiverUser.username} o total de ${quantity}$\n\nVocê tem certeza disso?`
        }, {
            components: [
                new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel('Confirmar')
                        .setStyle('SUCCESS')
                        .setCustomId('confirm'),

                    new MessageButton()
                        .setLabel('Cancelar')
                        .setStyle('DANGER')
                        .setCustomId('cancel')
                        
                )
            ]
        }));

        const collector = interaction.channel?.awaitMessageComponent({ 
            componentType: 'BUTTON',
            time: parseInt(<string>process.env.TRANSATION_TIMEOUT) ?? 1000 * 60,
            filter: ButtonInteraction => ButtonInteraction.member.id === interaction.user.id
        });

        collector
            ?.then(userRespondedToRequest)
            ?.catch(() => interaction.editReply(Embed.create('Erro', {
                title: 'Pagamento cancelado',
                description: 'A transação foi cancelada pois não foi confirmada'
            })));


        async function userRespondedToRequest(ButtonInteraction: ButtonInteraction<CacheType>) {
            ButtonInteraction.update({});

            switch(ButtonInteraction.customId) {
                case 'confirm':
                    await database.sender.updateOne({
                        money: database.sender.money - quantity
                    });
        
                    await database.receiver.updateOne({
                        money: database.receiver.money + quantity
                    });
        
                    interaction.editReply(Embed.create('Sucesso', {
                        title: 'Pagamento realizado',
                        description: `Você pagou ${quantity}$ para ${receiverUser.username}`
                    }, { components: [] }));

                    receiverUser.send(Embed.create('Info', `Você recebeu um pagamento de ${quantity}$ de ${interaction.user.username}`));
                break

                case 'cancel':
                    interaction.editReply(Embed.create('Erro', {
                        title: 'Pagamento cancelado',
                        description: `Você cancelou o pagamento de ${quantity}$ para ${receiverUser.username}`
                    }, { components: [] }));
                break
            }
        }
    }
})