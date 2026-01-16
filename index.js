require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const token = process.env.DISCORD_TOKEN;

const client = new Client({
  //intentsはいわば「このBotはどの情報にアクセスしたいか」を指定するオプション
  intents: [
    GatewayIntentBits.Guilds
  ],
});

client.commands = new Collection();

// commandsフォルダから、.jsで終わるファイルのみを取得
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // 取得した.jsファイル内の情報から、コマンドと名前をListenner-botに対して設定
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING]  ${filePath} のコマンドには、必要な "data" または "execute" プロパティがありません。`
      );
    }
  }
}


// eventsフォルダから、.jsで終わるファイルのみを取得
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}


client.login(token);
