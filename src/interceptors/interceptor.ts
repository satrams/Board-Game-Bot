import type { ButtonInteraction, CacheType, Message, MessageReaction, ModalSubmitInteraction, SelectMenuInteraction } from "discord.js";

export class Interceptor {

    constructor() {

    }

    async interceptMessage(_message: Message) {

    }

    async interceptModal(_modal: ModalSubmitInteraction) {

    }

    async interceptComponent(_component: SelectMenuInteraction<CacheType> | ButtonInteraction<CacheType>) {

    }

    async interceptReaction(_reaction: MessageReaction) {

    }
}