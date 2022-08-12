import type { Message, MessageReaction, TextChannel } from 'discord.js'
import { Interceptor } from './interceptor'
import { inviteChannel } from '../channelList.json';
import { client } from '../bot';

export class Voter extends Interceptor {


    override async interceptMessage(message: Message<boolean>): Promise<void> {

        if (message.author.bot) return;

        let channel = message.channel as TextChannel;
        let thread = await channel.threads.create({
            name: "Discussion Thread",
            startMessage: message,
        });

        await message.react("✅");
        await message.react("❌");

        thread.send("Vote started");

    }

    override async interceptReaction(reaction: MessageReaction): Promise<void> {

        let reactions = reaction.message.reactions.cache;

        if (reactions.get("👍")?.users.cache.has(client.user?.id as string)) return;

        let total = (reactions.get("✅")?.count as number - 1) - (reactions.get("❌")?.count as number - 1);

        if (total > (reaction.message.guild?.memberCount as number) / 2) {
            let channel = reaction.message.guild?.channels.cache.get(inviteChannel) as TextChannel;
            await reaction.message.react("👍");
            await reaction.message.author?.send(`Congrats! Your vote has been approved! Here's the invite link you can send to your friend (if you need a new one just ask):\n\n${await channel.createInvite({
                maxUses: 1,
                unique: true,
            })
                }`);
            await reaction.message.reply("This vote has been passed :)");
        }

    }



}