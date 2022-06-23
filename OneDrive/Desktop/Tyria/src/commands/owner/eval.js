const { SlashCommandBuilder, codeBlock } = require('@discordjs/builders');
const { inspect } = require('util');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Eval command for Sebazz')
		.addStringOption((options) =>
			options //
				.setName('code')
				.setDescription('el codigo a evaluar papalindo'),
		),
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	async execute(interaction) {
		const code = interaction.options.getString('code');
		const codeEvalued = await eval(code);
		const codeInspected = inspect(codeEvalued, { depth: 0 });

		interaction.reply(`**Output**\n${codeBlock('js', codeInspected)}`);
	},
};
