const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: () => new SlashCommandBuilder()
    .setName('help')
    .setDescription('Zeigt alle verfügbaren Befehle und deren Beschreibung an'),
  async execute(interaction) {
    // Alle Commands aus dem commands-Ordner laden
    const commandsPath = path.join(__dirname);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commands = [];
    for (const file of commandFiles) {
      if (file === 'help.js') continue;
      const cmd = require(path.join(commandsPath, file));
      const data = typeof cmd.data === 'function' ? await cmd.data() : cmd.data;
      commands.push({
        name: `/${data.name}`,
        description: data.description || 'Keine Beschreibung'
      });
    }
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('❓ Hilfe / Help')
      .setDescription('Hier sind alle verfügbaren Slash-Commands:')
      .addFields(
        commands.map(cmd => ({
          name: cmd.name,
          value: cmd.description,
          inline: false
        }))
      )
      .setFooter({ text: 'AvocatoDev Backup Bot Hilfe' });
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
}; 