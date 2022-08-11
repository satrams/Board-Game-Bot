import { token } from './secret.json';
import { Client, IntentsBitField, InteractionType } from 'discord.js';
import type { Interceptor } from './interceptors/interceptor';
import { Scheduler } from './interceptors/scheduler';
import { Voter } from './interceptors/voter';

const client = new Client({
	intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers, IntentsBitField.Flags.GuildEmojisAndStickers, IntentsBitField.Flags.GuildInvites, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.GuildMessageReactions, IntentsBitField.Flags.GuildMessageTyping],
});

client.on('ready', () => {
	console.log('bot started');
});

const voter = new Voter();
const scheduler = new Scheduler();

client.on('messageCreate', async (message) => {

	// Specific behaviour for if the message occured in a specific channel
	const channelIntercepts: Map<String, Interceptor> = new Map<String, Interceptor>([
		['995881833231298640', voter],
		['995881524962533446', scheduler],
	]);

	let interceptor = channelIntercepts.get(message.channelId);
	console.log(interceptor);
	interceptor?.interceptMessage(message);
});

client.on('interactionCreate', interaction => {
	if (interaction.type !== InteractionType.ModalSubmit) return;
	const interactionIntercepts: Map<String, Interceptor> = new Map<String, Interceptor>([
		['Set Amount Modal', scheduler]
	])

	let interceptor = interactionIntercepts.get(interaction.customId);
	console.log(interceptor);
	interceptor?.interceptModal(interaction);

})

// Always keep this at the end of this file for simplicity
client.login(token);