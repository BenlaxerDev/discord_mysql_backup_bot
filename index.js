const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');
const config = require('config');
const fs = require('fs');
const path = require('path');

const { token, clientId, guildId } = config.get('discord');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
client.commands = new Map();

// Commands dynamisch laden
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

let commandsData = [];

const BACKUP_DIR = path.join(__dirname, 'sql_backups');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

(async () => {
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    // .data ist async, weil Datenbankabfrage nötig ist
    const data = await command.data();
    client.commands.set(data.name, command);
    commandsData.push(data.toJSON());
  }
})();

client.once('ready', async () => {
  console.log(`Eingeloggt als ${client.user.tag}`);
  await registerSlashCommands();
});

async function registerSlashCommands() {
  const rest = new REST({ version: '10' }).setToken(token);
  try {
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commandsData }
    );
    console.log('Slash Commands registriert!');
  } catch (error) {
    console.error(error);
  }
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Beim Ausführen des Befehls ist ein Fehler aufgetreten!', ephemeral: true });
  }
});

client.login(token); 