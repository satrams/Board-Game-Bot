import { token } from './secret.json';
import { Client, IntentsBitField, InteractionType, MessageReaction, Partials } from 'discord.js';
import type { Interceptor } from './interceptors/interceptor';
import * as CHANNELLIST from './channelList.json';
import { Scheduler } from './interceptors/scheduler';
import { Voter } from './interceptors/voter';
import { Showcaser } from './interceptors/showcaser';

export const client = new Client({
	intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildEmojisAndStickers, IntentsBitField.Flags.GuildInvites, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessageReactions, IntentsBitField.Flags.GuildMessageTyping],
	partials: [Partials.Reaction, Partials.Message]
});

client.on('ready', () => {
	console.log('bot started');
});

const voter = new Voter();
const scheduler = new Scheduler();
const showcaser = new Showcaser();

const catchErrors = <T extends any[]>(handler: (...args: T) => Promise<any>) => async (...args: T) => {
	try {
		return handler(...args);
	} catch (e) {
		console.error(e);
	}
};

client.on('messageCreate', catchErrors(async (message) => {
	// Specific behaviour for if the message occured in a specific channel
	const channelIntercepts: Map<String, Interceptor> = new Map<String, Interceptor>([
		[CHANNELLIST.voteChannel, voter],
		[CHANNELLIST.scheduleChannel, scheduler],
		[CHANNELLIST.showcaseChannel, showcaser]
	]);

	let interceptor = channelIntercepts.get(message.channelId);
	console.log(interceptor);
	interceptor?.interceptMessage(message);
}));

client.on('interactionCreate', catchErrors(async (interaction) => {
	if (interaction.type == InteractionType.ModalSubmit) {
		const modalIntercepts: Map<String, Interceptor> = new Map<String, Interceptor>([
			['Scheduler Set Amount Modal', scheduler]
		])

		let interceptor = modalIntercepts.get(interaction.customId);
		console.log(interceptor);
		interceptor?.interceptModal(interaction);
	}
	else if (interaction.type == InteractionType.MessageComponent) {
		const componentIntercepts: Map<String, Interceptor> = new Map<String, Interceptor>([
			['Scheduler Set Participants Number', scheduler]
		])

		let interceptor = componentIntercepts.get(interaction.customId);
		console.log(interceptor);
		interceptor?.interceptComponent(interaction);
	}


}));

client.on('messageReactionAdd', catchErrors(async (reaction) => {

	reaction = reaction.partial ? await reaction.fetch() : reaction; //If the reaction is a partial, reconstruct it first, and then continue with the rest of the function.

	const reactionChannelIntercepts: Map<String, Interceptor> = new Map<String, Interceptor>([
		[CHANNELLIST.voteChannel, voter],
	]);

	let interceptor = reactionChannelIntercepts.get(reaction.message.channelId);
	console.log(interceptor);
	interceptor?.interceptReaction(reaction as MessageReaction);

}));

// Always keep this at the end of this file for simplicity
client.login(token);