import type { Message } from 'discord.js'
import { Interceptor } from './interceptor'
import { threadFromMessage } from './common';

export class Showcaser extends Interceptor {

    override async interceptMessage(message: Message<boolean>): Promise<void> {
        if (message.author.bot) return;

        threadFromMessage(message);

    }
}