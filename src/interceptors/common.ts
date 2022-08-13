import type { AnyThreadChannel, Message, TextChannel } from "discord.js";


export async function threadFromMessage(message: Message): Promise<AnyThreadChannel> {

    let channel = message.channel as TextChannel;
    return await channel.threads.create({
        name: message.content.substring(0, Math.min(15, message.content.length)),
        startMessage: message,
    });

}