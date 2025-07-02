const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'sql_backups');

function getBackupList() {
  const files = fs.readdirSync(BACKUP_DIR).filter(f => f.endsWith('.sql'));
  return files.map(f => {
    const match = f.match(/backup-#(\d+)-(.+)-(\d+)\.sql/);
    if (!match) return null;
    return {
      id: match[1],
      db: match[2],
      timestamp: match[3],
      filename: f
    };
  }).filter(Boolean);
}

module.exports = {
  data: () => new SlashCommandBuilder()
    .setName('listbackups')
    .setDescription('Zeigt alle verfügbaren Backups mit ID, Datenbank und Datum an'),
  async execute(interaction) {
    const backups = getBackupList();
    if (backups.length === 0) {
      await interaction.reply('Es sind keine Backups vorhanden.');
      return;
    }
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('📋 Backup-Liste')
      .setDescription('Alle verfügbaren Backups:')
      .addFields(
        backups.map(b => ({
          name: `#${b.id} (${b.db})`,
          value: `Datei: \`${b.filename}\`\nErstellt: <t:${Math.floor(Number(b.timestamp)/1000)}:F>`
        }))
      )
      .setImage(require('config').get('thumbnail'))
      .setFooter({ text: `🟢 AvocatoDev Backup Service • Stand: ${new Date().toLocaleString('de-DE')}` });
    await interaction.reply({ embeds: [embed] });
  }
}; 