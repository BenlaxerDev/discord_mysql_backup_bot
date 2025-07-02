const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('config');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const mysqlConfig = config.get('mysql');
const BACKUP_DIR = path.join(__dirname, '..', 'sql_backups');

async function getDatabaseChoices() {
  const connection = await mysql.createConnection(mysqlConfig);
  const [rows] = await connection.query('SHOW DATABASES');
  await connection.end();
  const exclude = ['information_schema', 'mysql', 'performance_schema', 'sys'];
  return rows
    .filter(row => !exclude.includes(row.Database))
    .map(row => ({ name: row.Database, value: row.Database }));
}

function getBackupChoices() {
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.sql'));
  // Extrahiere ID und Name für Dropdown
  return files.map(f => {
    const match = f.match(/backup-#(\d+)-(.+)-(\d+)\.sql/);
    if (!match) return null;
    return {
      name: `#${match[1]} (${match[2]})`,
      value: f
    };
  }).filter(Boolean);
}

module.exports = {
  data: async () => {
    const dbChoices = await getDatabaseChoices();
    const backupChoices = getBackupChoices();
    return new SlashCommandBuilder()
      .setName('restore')
      .setDescription('Stelle ein Backup in eine Datenbank wieder her')
      .addStringOption(option =>
        option.setName('backupfile')
          .setDescription('Wähle das Backup')
          .setRequired(true)
          .addChoices(...backupChoices)
      )
      .addStringOption(option =>
        option.setName('datenbank')
          .setDescription('Wähle die Zieldatenbank')
          .setRequired(true)
          .addChoices(...dbChoices)
      );
  },
  async execute(interaction) {
    const backupFile = interaction.options.getString('backupfile');
    const dbName = interaction.options.getString('datenbank');
    const filepath = path.join(BACKUP_DIR, backupFile);
    await interaction.deferReply();
    const now = new Date();
    // Importiere das Backup in die Datenbank
    const importCmd = `mysql -u${mysqlConfig.user} -p${mysqlConfig.password} -h${mysqlConfig.host} ${dbName} < "${filepath}"`;
    exec(importCmd, (error, stdout, stderr) => {
      if (error) {
        interaction.editReply(`❌ Fehler beim Wiederherstellen: ${stderr || error.message}`);
        return;
      }
      const embed = new EmbedBuilder()
        .setColor(0x00cc66)
        .setTitle('♻️ Backup Wiederhergestellt')
        .setDescription('Das Backup wurde erfolgreich in die Datenbank importiert.')
        .addFields(
          { name: '📁 Backup-Datei', value: `\`\`\`${backupFile}\`\`\`` },
          { name: '🗄️ Ziel-Datenbank', value: `\`\`\`${dbName}\`\`\`` },
          { name: '⏰ Timestamp', value: `<t:${Math.floor(now.getTime() / 1000)}:F>` }
        )
        .setImage(require('config').get('thumbnail'))
        .setFooter({ text: `🟢 AvocatoDev Backup Service © 2022-${now.getFullYear()} • ${now.toLocaleTimeString('de-DE')}` });
      interaction.editReply({ content: '✅ Wiederherstellung abgeschlossen!', embeds: [embed] });
    });
  }
}; 