import type { AnyThreadChannel, Message, TextChannel } from "discord.js";


const threadTitleMaxLength = 40;


export async function threadFromMessage(message: Message): Promise<AnyThreadChannel> {

    let channel = message.channel as TextChannel;
    return await channel.threads.create({
        name: message.content.substring(0, Math.min(threadTitleMaxLength, message.content.length)),
        startMessage: message,
    });

}