const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const quests = require('../../utils/quests.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('quest')
		.setDescription('📜 Comandos de misiones')
		.addSubcommand((subcommandList) =>
			subcommandList.setName('list').setDescription('📜 Tablero de misiones'),
		)
		.addSubcommand((subcommandList) =>
		    subcommandList.setName('take').setDescription('📜 Mira la información de una misión en específico').addIntegerOption(options =>
				options
					.setName('id')
					.setDescription('La id de la misión a la que verás la información')
					.setRequired(true),
			),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'list') {
			const embed = new MessageEmbed()
				.setTitle('Tablero de misiones')
				.setDescription(
					'Utiliza el comando `/quest take <número>` para tomar una misión\n\n' +
						quests
							.slice(0, 9)
							.map((i) => `\`${i.id}\` | **${i.title}**\n${i.description}`)
							.join('\n\n'),
				);

			await interaction.reply({ embeds: [embed] });
		}
		if (interaction.options.getSubcommand() === 'take') {
			const id = interaction.options.getInteger('id');
			const quest = quests.find(q => q.id === id);

			if (!quest) {return await interaction.reply({
				content: 'No hay ninguna misión con esta id',
				ephemeral: true,
			});}

			const embed = new MessageEmbed()
				.setTitle(`Misión: ${quest.title}`)
				.setDescription(`**Descripción**\n${quest.description}\n\n**Enemigos**\n${quest.mobs}\n\n**Historia**\n${quest.story === '' ? 'Ninguna' : quest.story}\n\n**Nivel requerido**\nPara poder jugar esta misión debes tener un nivel igual o superior a \`${quest.level}\`\n\n**Recompensa**\n${quest.reward}`)
				.setTimestamp();

			return await interaction.reply({
				embeds: [embed],
			});
		}
	},
};
