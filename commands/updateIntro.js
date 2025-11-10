const { SlashCommandBuilder } = require('discord.js');
const { createIntroModal } = require('../utils/introModal');
const { getUserProfile } = require('../utils/updateProfile');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('update_intro')
    .setDescription('Update your introduction - opens a form pre-filled with your current info'),

  async execute(interaction) {
    try {
      const userId = interaction.user.id;
      const username = interaction.user.username;

      console.log(`🔄 /update_intro command from ${username}`);

      const userProfile = await getUserProfile(userId);
      
      const modal = createIntroModal(userProfile?.introData);
      await interaction.showModal(modal);
      
      console.log(`📝 Update intro modal shown to ${username}`);

    } catch (error) {
      console.error('❌ Error showing update intro modal:', error);
      await interaction.reply({
        content: '❌ Failed to open the update form. Please try again.',
        ephemeral: true
      }).catch(() => {});
    }
  }
};
