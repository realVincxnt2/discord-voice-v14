const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const ExtendedClient = require("../../structures/extendedClient");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rename")
    .setDescription("Rename your voice channel")
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("Name of the voice channel")
        .setRequired(true)
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction, client) {
    const { member, guild } = interaction;
    const newVoiceChannelName = interaction.options.get("name");
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

    guildVoiceChannel.edit({
      name: `${newVoiceChannelName.value}`,
    });

    return interaction.reply({
      content: `Successfully renamed your voice channel to \`${newVoiceChannelName.value}\``,
    });
  },
};
