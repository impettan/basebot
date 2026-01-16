const { Events } = require('discord.js');
const { name, execute } = require("./interactionCreate");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log("起動しました。");
	},
};
