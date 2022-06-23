const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder().setName('ping').setDescription('🏓 Reply with pong!'),
	async execute(interaction) {
		await interaction.reply(':ping_pong: `' + interaction.client.ws.ping + '` ms.');
	},
};
