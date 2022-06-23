const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();

const commands = [];

const folder = fs.readdirSync('./src/commands/');
for (const module of folder) {
	const commandFiles = fs
		.readdirSync(`./src/commands/${module}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${module}/${file}`);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_CLIENT_TOKEN);

(async () => {
	try {
		console.log('✅ Started refreshing application (/) commands.');

		const response = await rest.put(
			Routes.applicationGuildCommands(
				process.env.DISCORD_CLIENT_ID,
				process.env.DISCORD_GUILD_ID,
			),
			{
				body: commands,
			},
		);
		console.log('✅ Successfully reloaded application (/) commands.');

		console.log('\n📚 Command list');
		response.forEach((element) => {
			console.log(`🆔 ${element.id} | 📖 ${element.name} `);
		});
	} catch (error) {
		console.error(error);
	}
})();
