const { SlashCommandBuilder, CommandInteraction } = require("discord.js");
const ExtendedClient = require("../../structures/extendedClient");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user from the voice channel")
    .addUserOption((option) =>
      option.setName("user").setDescription("Kick User").setRequired(true)
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction, client) {
    const { member, guild } = interaction;
    const kickUser = interaction.options.getUser("user");
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

    guildVoiceChannel.permissionOverwrites.delete(kickUser.id);
    guild.members.cache.get(kickUser.id).voice.setChannel(null);

    await kickUser.send({
      content: `You have been kicked from the voice channel (<#${guildVoiceChannel.id}>)`,
    });

    return interaction.reply({
      content: `Successfully kicked \`${kickUser.tag}\` from your voice channel`,
    });
  },
};
