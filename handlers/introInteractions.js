const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createIntroModal } = require('../utils/introModal');
const { generateIntroSummary, getExperienceColor, getExperienceEmoji } = require('../utils/aiIntroSummary');
const { getUserProfile, saveUserProfile, deleteUserProfile } = require('../utils/updateProfile');
const { loadConfig } = require('../utils/configManager');
const { safeDefer, safeError } = require('../utils/safeReply');

async function handleIntroButton(interaction) {
  try {
    const modal = createIntroModal();
    await interaction.showModal(modal);
    console.log(`📝 Intro modal shown to ${interaction.user.tag}`);
  } catch (error) {
    console.error('❌ Error showing intro modal:', error);
    await safeError(interaction, '❌ Failed to show introduction form', error);
  }
}

async function handleIntroModal(interaction) {
  const deferred = await safeDefer(interaction, { ephemeral: true });
  if (!deferred) {
    console.error('❌ Failed to defer intro modal interaction');
    return;
  }

  try {
    let name, role, institution, interests, details;
    
    try {
      name = interaction.fields.getTextInputValue('intro_name')?.trim() || 'Not provided';
      role = interaction.fields.getTextInputValue('intro_role')?.trim() || 'Not provided';
      institution = interaction.fields.getTextInputValue('intro_institution')?.trim() || 'Not specified';
      interests = interaction.fields.getTextInputValue('intro_interests')?.trim() || 'Not provided';
      details = interaction.fields.getTextInputValue('intro_details')?.trim() || 'Not provided';
    } catch (fieldError) {
      console.error('❌ Error reading modal fields:', fieldError);
      await interaction.editReply({
        content: '❌ Failed to read form data. Please try submitting again.'
      });
      return;
    }

    if (!name || name === 'Not provided' || name.length < 2) {
      await interaction.editReply({
        content: '❌ Please provide your name in the form.'
      });
      return;
    }

    if (!interests || interests === 'Not provided' || interests.length < 3) {
      await interaction.editReply({
        content: '❌ Please provide your interests in AI fields or tools.'
      });
      return;
    }

    const introData = { name, role, institution, interests, details };

    console.log(`📝 Processing introduction from ${interaction.user.tag}`);

    const config = loadConfig();
    const profileChannelId = config.profileChannelId || process.env.PROFILE_CHANNEL_ID;
    
    if (!profileChannelId) {
      console.error('❌ Profile channel not configured');
      await interaction.editReply({
        content: '❌ Profile channel is not configured. Please ask an admin to run `/setup-bot`.'
      });
      return;
    }

    let profileChannel;
    try {
      profileChannel = await interaction.client.channels.fetch(profileChannelId);
      if (!profileChannel) {
        throw new Error('Channel not found');
      }
      
      const permissions = profileChannel.permissionsFor(interaction.client.user);
      if (!permissions.has('SendMessages') || !permissions.has('EmbedLinks')) {
        throw new Error('Missing permissions');
      }
    } catch (error) {
      console.error('❌ Failed to fetch or access profile channel:', error.message);
      await interaction.editReply({
        content: '❌ Could not access the profile channel. Please contact an admin to check bot permissions.'
      });
      return;
    }

    await interaction.editReply({
      content: '⏳ Processing your introduction with AI... This may take a moment.'
    });

    const aiResult = await generateIntroSummary(introData);
    
    let summary, experienceLevel, skills;
    
    if (aiResult.success) {
      summary = aiResult.summary;
      experienceLevel = aiResult.experienceLevel;
      skills = aiResult.skills;
    } else {
      console.warn('⚠️ AI processing failed, using fallback');
      summary = aiResult.fallback.summary;
      experienceLevel = aiResult.fallback.experienceLevel;
      skills = aiResult.fallback.skills;
    }

    const existingProfile = await getUserProfile(interaction.user.id);
    if (existingProfile && existingProfile.messageId) {
      try {
        const oldMessage = await profileChannel.messages.fetch(existingProfile.messageId);
        await oldMessage.delete();
        console.log(`🔄 Updated intro - Deleted old profile for ${interaction.user.tag}`);
      } catch (err) {
        console.warn(`⚠️ Could not delete old profile message (may have been manually deleted):`, err.message);
      }
    }

    const embedColor = getExperienceColor(experienceLevel);
    const levelEmoji = getExperienceEmoji(experienceLevel);

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`${levelEmoji} Member Introduction`)
      .setDescription(`<@${interaction.user.id}>\n\n${summary}`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .addFields(
        { name: '🎓 Name', value: name, inline: true },
        { name: '💼 Role / Study', value: role, inline: true },
        { name: '📊 Experience', value: `${levelEmoji} ${experienceLevel}`, inline: true }
      );

    if (institution && institution !== 'Not specified') {
      embed.addFields({ name: '🏫 Institution', value: institution, inline: true });
    }

    embed.addFields(
      { name: '🤖 Interests', value: interests, inline: false },
      { name: '🧠 Skills', value: skills, inline: false }
    );

    embed.setFooter({ 
      text: '🛡️ Verified Intro', 
      iconURL: interaction.client.user.displayAvatarURL() 
    });
    embed.setTimestamp();

    let profileMessage;
    try {
      profileMessage = await profileChannel.send({ 
        embeds: [embed]
      });
      console.log(`✅ Intro posted for ${interaction.user.tag} in channel`);
    } catch (error) {
      console.error('❌ Failed to send profile message:', error);
      await interaction.editReply({
        content: '❌ Failed to post your profile. Please contact an admin.'
      });
      return;
    }

    await saveUserProfile(interaction.user.id, profileMessage.id, {
      introData,
      summary,
      experienceLevel,
      skills
    });

    const buttons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`update_intro_${interaction.user.id}`)
          .setLabel('Update Intro')
          .setEmoji('🔁')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`delete_intro_${interaction.user.id}`)
          .setLabel('Delete Intro')
          .setEmoji('🗑️')
          .setStyle(ButtonStyle.Danger)
      );

    await interaction.editReply({
      content: `✅ Your introduction has been posted!\n📋 Check it out in ${profileChannel}`,
      components: [buttons]
    });

    setTimeout(() => {
      interaction.deleteReply().catch(() => {});
    }, 15000);

    console.log(`✅ Profile created for ${interaction.user.tag} - ${experienceLevel}`);

  } catch (error) {
    console.error('❌ Error processing intro modal:', error);
    await safeError(interaction, '⚠️ Something went wrong while processing your introduction. Please try again.', error);
  }
}

async function handleUpdateIntroButton(interaction) {
  try {
    const userId = interaction.customId.split('_')[2];
    
    if (interaction.user.id !== userId) {
      await interaction.reply({
        content: '❌ You can only update your own introduction.',
        ephemeral: true
      });
      return;
    }

    const userProfile = await getUserProfile(userId);
    
    const modal = createIntroModal(userProfile?.introData);
    await interaction.showModal(modal);
    console.log(`📝 Update intro modal shown to ${interaction.user.tag}`);
  } catch (error) {
    console.error('❌ Error showing update modal:', error);
    await safeError(interaction, '❌ Failed to show update form. Please try again.', error);
  }
}

async function handleDeleteIntroButton(interaction) {
  try {
    const userId = interaction.customId.split('_')[2];
    
    if (interaction.user.id !== userId) {
      await interaction.reply({
        content: '❌ You can only delete your own introduction.',
        ephemeral: true
      });
      return;
    }

    const confirmButtons = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`confirm_delete_intro_${userId}`)
          .setLabel('Yes, Delete')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId(`cancel_delete_intro_${userId}`)
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({
      content: '⚠️ Are you sure you want to delete your introduction? This cannot be undone.',
      components: [confirmButtons],
      ephemeral: true
    });
  } catch (error) {
    console.error('❌ Error showing delete confirmation:', error);
    await safeError(interaction, '❌ Failed to show delete confirmation. Please try again.', error);
  }
}

async function handleConfirmDeleteIntro(interaction) {
  try {
    const userId = interaction.customId.split('_')[3];
    
    if (interaction.user.id !== userId) {
      await interaction.update({
        content: '❌ You can only delete your own introduction.',
        components: []
      });
      return;
    }

    const userProfile = await getUserProfile(userId);
    
    if (!userProfile || !userProfile.messageId) {
      await interaction.update({
        content: '❌ Could not find your introduction.',
        components: []
      });
      return;
    }

    const config = loadConfig();
    const profileChannelId = config.profileChannelId || process.env.PROFILE_CHANNEL_ID;
    
    if (!profileChannelId) {
      console.error('❌ Profile channel not configured for deletion');
      await interaction.update({
        content: '❌ Profile channel is not configured. Please contact an admin.',
        components: []
      });
      return;
    }
    
    try {
      const profileChannel = await interaction.client.channels.fetch(profileChannelId);
      const message = await profileChannel.messages.fetch(userProfile.messageId);
      await message.delete();
      console.log(`✅ Deleted intro for ${interaction.user.tag} (Message ID: ${userProfile.messageId})`);
    } catch (error) {
      console.warn(`⚠️ Could not delete message for ${interaction.user.tag}:`, error.message);
    }

    await deleteUserProfile(userId);

    await interaction.update({
      content: '✅ Your introduction has been deleted.',
      components: []
    });
    
    console.log(`✅ Intro deletion completed for ${interaction.user.tag}`);

  } catch (error) {
    console.error('❌ Error deleting intro:', error);
    try {
      await interaction.update({
        content: '❌ Failed to delete your introduction. Please try again.',
        components: []
      });
    } catch (updateError) {
      console.error('❌ Could not update interaction:', updateError);
    }
  }
}

async function handleCancelDeleteIntro(interaction) {
  try {
    await interaction.update({
      content: '✅ Deletion cancelled.',
      components: []
    });
  } catch (error) {
    console.error('❌ Error cancelling delete:', error);
  }
}

async function handleEditProfileModal(interaction) {
  await handleIntroModal(interaction);
}

module.exports = {
  handleIntroButton,
  handleIntroModal,
  handleEditProfileModal,
  handleUpdateIntroButton,
  handleDeleteIntroButton,
  handleConfirmDeleteIntro,
  handleCancelDeleteIntro
};
