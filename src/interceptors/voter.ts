import type { Message, MessageReaction, TextChannel } from 'discord.js'
import { Interceptor } from './interceptor'
import { inviteChannel } from '../channelList.json';
import { client } from '../bot';
import { threadFromMessage } from './common'

export class Voter extends Interceptor {


    override async interceptMessage(message: Message<boolean>): Promise<void> {

        if (message.author.bot) return;

        let thread = await threadFromMessage(message);

        await message.react("✅");
        await message.react("❌");

        thread.send("Vote started");

    }

    override async interceptReaction(reaction: MessageReaction): Promise<void> {

        if (reaction.client.user?.bot) return;

        let reactions = reaction.message.reactions.cache;

        if (reactions.get("👍")?.users.cache.has(client.user?.id as string)) return;

        const total = (reactions.get("✅")?.count as number - 1) - (reactions.get("❌")?.count as number - 1);
        const required = (reaction.message.guild?.memberCount as number) / 2;

        if (total > required) {
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