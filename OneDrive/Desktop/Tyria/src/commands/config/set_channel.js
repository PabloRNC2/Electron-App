const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set_channel')
		.setDescription('Establishes a channel where Tyria\'s commands can be used')
		.addChannelOption((options) =>
			options
				.setName('channel')
				.setDescription('The channel on which the commands will be available for use')
				.addChannelTypes(0)
				.setRequired(true),
		),
	async execute(interaction) {

		const channel = interaction.options.getChannel('channel');

		if (!interaction.member.permissions.has('ADMINISTRATOR')) {
			return await interaction.reply({
				content: 'You can\'t execute this command',
				ephemeral: true,
			});}


		await interaction.reply({
			content: '✅ This channel was successfully set up to use Tyria\'s commands',
			ephemeral: true,
		});

		const embed = new MessageEmbed()
			.setTitle('TYRIA WELCOME')
			.setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
			.setDescription('> Welcome to Tyria, an awesome word where you can be great adventurers.\n> To start your adventure execute the battle command or the quest board')
			.setTimestamp()
			.setColor('BLUE');

		const msg = await interaction.channel.send({ embeds: [embed] });
		msg.pin('TYRIA WELCOME');

		const guildID = interaction.guild.id;
		const channelID = channel.id;


		console.log(guildID);
		console.log(channelID);
	},
};
