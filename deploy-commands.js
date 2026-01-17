require('dotenv').config(); // .envから環境変数を読み込む
const { REST, Routes } = require('discord.js');
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
// commandsフォルダからコマンドファイルの取得
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// 以前作成した commands ディレクトリから、すべてのコマンドファイルを取得する
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	// デプロイ用に、各コマンドの data（SlashCommandBuilder）の toJSON() 出力を取得する
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// REST モジュールのインスタンスを生成し、準備する
const rest = new REST().setToken(token);

// コマンドをデプロイする
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// put メソッドは、現在のコマンドセットでギルド内のすべてのコマンドを完全に更新するために使用される
		const data = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// 忘れずに、発生したエラーは必ずキャッチしてログに出力する
		console.error(error);
	}
})();
