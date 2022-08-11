import { Message, TextChannel, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, ModalActionRowComponent, ModalActionRowComponentBuilder, InteractionType, CacheType, ModalSubmitInteraction, TextInputStyle, ButtonStyle } from 'discord.js'
import { Interceptor } from './interceptor'

const button = new ButtonBuilder()
    .setLabel('Set Participants Number')
    .setCustomId('Set Participants Number')
    .setStyle(ButtonStyle.Primary);

const row = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(
        button
    )


const text_input = new TextInputBuilder()
    .setLabel("Number of Participants")
    .setCustomId("Number of Participants")
    .setStyle(TextInputStyle.Short);

const modal = new ModalBuilder()
    .setCustomId('Set Amount Modal')
    .setTitle("Set Participants")
    .addComponents(new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(text_input));

const embed = new EmbedBuilder()
    .setTitle("Scheduled Event")
    .setFooter({ text: "✅ = Yes I want to and can make it 100%\n ❔ = I am interested but am not sure if I can go" });

export class Scheduler extends Interceptor {

    override async interceptMessage(message: Message<boolean>): Promise<void> {
        let channel = message.channel as TextChannel;
        let thread = await channel.threads.create({
            name: "Discussion Thread",
            startMessage: message,
        })
        embed
            .setAuthor({ name: message.author.username })
            .setDescription("This is an event that could be scheduled if the required amount of people are available.\nRequired People: ? (set this value)");
        let bot_message = await thread.send({ embeds: [embed], components: [row] })
        await bot_message.react("✅");
        await bot_message.react("❔");

        const collector = bot_message.createMessageComponentCollector();
        collector.on('collect', async i => {
            i.showModal(modal);
        });
    };

    override async interceptModal(modal: ModalSubmitInteraction<CacheType>): Promise<void> {
        let value = modal.fields.getTextInputValue('Number of Participants');
        let number = parseInt(value);

        if (number > 1) {
            embed
                .setAuthor({ name: modal.message?.author.username ? modal.message?.author.username : "null" })
                .setDescription(`This is an event that could be scheduled if the required amount of people are available.\nRequired People: ${number}`);
            await modal.message?.edit({ embeds: [embed], components: [row] });
            await modal.reply({ content: `The number of people has been changed to ${number}` });
            return;
        }
        await modal.reply({ content: 'There was an issue setting the number of participants (make sure you typed a valid number)', ephemeral: true })
    }
}
