const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('config');
const mysqldump = require('mysqldump');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const mysqlConfig = config.get('mysql');
const BACKUP_DIR = path.join(__dirname, '..', 'sql_backups');
const COUNTER_FILE = path.join(__dirname, '..', 'backup_counter.json');
if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR);

function getNextBackupId() {
  let counter = { id: 1 };
  if (fs.existsSync(COUNTER_FILE)) {
    counter = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
    counter.id++;
  }
  fs.writeFileSync(COUNTER_FILE, JSON.stringify(counter));
  return counter.id;
}

async function getDatabaseChoices() {
  const connection = await mysql.createConnection(mysqlConfig);
  const [rows] = await connection.query('SHOW DATABASES');
  await connection.end();
  const exclude = ['information_schema', 'mysql', 'performance_schema', 'sys'];
  return rows
    .filter(row => !exclude.includes(row.Database))
    .map(row => ({ name: row.Database, value: row.Database }));
}

module.exports = {
  data: async () => {
    const choices = await getDatabaseChoices();
    return new SlashCommandBuilder()
      .setName('backup')
      .setDescription('Erstelle ein Backup einer MySQL-Datenbank')
      .addStringOption(option =>
        option.setName('datenbank')
          .setDescription('Wähle die Datenbank')
          .setRequired(true)
          .addChoices(...choices)
      );
  },
  async execute(interaction) {
    const dbName = interaction.options.getString('datenbank');
    await interaction.deferReply();
    const now = new Date();
    const timestamp = now.getTime();
    const backupId = getNextBackupId();
    const filename = `backup-#${backupId}-${dbName}-${timestamp}.sql`;
    const filepath = path.join(BACKUP_DIR, filename);
    try {
      await mysqldump({
        connection: { ...mysqlConfig, database: dbName },
        dumpToFile: filepath
      });
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`📦 Backup #${backupId} - Erfolgreich gespeichert`)
        .setDescription('Die Datenbank wurde erfolgreich gesichert und als Anhang gespeichert. Alle wichtigen Daten sind enthalten.')
        .addFields(
          { name: '📁 Dateipfad', value: `\`\`\`sql\n${'sql_backups/' + filename}\n\`\`\`` },
          { name: '🗄️ Datenbank', value: `\`\`\`${dbName}\`\`\`` },
          { name: '⏰ Timestamp', value: `<t:${Math.floor(timestamp / 1000)}:F>` },
          { name: '🆔 Backup-ID', value: `#${backupId}` }
        )
        .setImage(config.get('thumbnail'))
        .setFooter({ 
          text: `🟢 AvocatoDev Backup Service © 2022-${now.getFullYear()} • ${now.toLocaleTimeString('de-DE')}`
        });
      await interaction.editReply('Backup wurde erfolgreich erstellt!');
      await interaction.channel.send({
        embeds: [embed],
        files: [{ attachment: filepath, name: filename }]
      });
    } catch (err) {
      await interaction.editReply('❌ Fehler beim Backup: ' + err.message);
    }
  }
}; 