const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const ExtendedClient = require("../../structures/extendedClient");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("limit")
    .setDescription("Set the limit of your voice channel")
    .addNumberOption((option) =>
      option.setName("size").setDescription("Size (1-99)").setRequired(true)
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction, client) {
    const { member, guild } = interaction;
    const limit = interaction.options.get("size");
    const voiceChannel = client.voiceChannels.get(member.id);
    if (!voiceChannel)
      return interaction.reply({
        content: "You don't have a voice channel",
        ephemeral: true,
      });

    const guildVoiceChannel = guild.channels.cache.get(voiceChannel);
    if (!guildVoiceChannel)
      return interaction.reply({
        content: "Error! Please create a new voice channel",
        ephemeral: true,
      });

    if (limit.value <= 0 || limit.value > 99)
      return interaction.reply({
        content: "Limit needs to be between 1 and 99",
        ephemeral: true,
      });

    guildVoiceChannel.edit({
      userLimit: limit.value,
    });

    return interaction.reply({
      content: `Successfully set the limit of your voice channel to \`${limit.value}\``,
    });
  },
};
