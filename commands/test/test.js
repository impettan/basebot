const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('hello と返します'),
	async execute(interaction) {
		await interaction.reply('hello');
	},
};
