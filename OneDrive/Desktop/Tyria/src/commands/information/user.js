const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('👤 Reply with the user information.'),
	async execute(interaction) {
		await interaction.reply(
			`**Your tag:** ${interaction.user.tag}\n**Your id:** ${interaction.user.id}`,
		);
	},
};
