const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require('config');

module.exports = {
  data: () => new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Zeigt die Bot-Latenz und einen Fun-Fact an!'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Pinge...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const funFacts = [
      'Wusstest du? MySQL wurde nach der Tochter des Mitgründers benannt!',
      'Discord wurde ursprünglich für Gamer entwickelt. 🎮',
      'Backups retten Leben – zumindest digitale! 💾',
      'Slash Commands machen Bots viel cooler! 😎',
      'BenlaxerDev liebt Open Source! ❤️'
    ];
    const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle('🏓 Pong!')
      .setDescription(`**Latenz:** \`${latency}ms\``)
      .addFields({ name: '💡 Fun Fact', value: fact })
      .setImage(config.get('thumbnail'))
      .setFooter({ text: 'AvocatoDev Ping Service' });
    await interaction.editReply({ content: null, embeds: [embed] });
  }
}; 