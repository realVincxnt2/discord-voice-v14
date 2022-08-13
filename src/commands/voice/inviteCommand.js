const {
  SlashCommandBuilder,
  CommandInteraction,
} = require("discord.js");
const ExtendedClient = require("../../structures/extendedClient");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite a user to your voice channel")
    .addUserOption((option) =>
      option.setName("user").setDescription("Invite User").setRequired(true)
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction, client) {
    const { member, guild } = interaction;
    const inviteUser = interaction.options.getUser("user");
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

    guildVoiceChannel.permissionOverwrites.edit(inviteUser.id, {
      Connect: true,
    });

    await inviteUser.send({
      content: `New Invite from \`${member.user.tag}!\`!\nJoin his voice channel (<#${guildVoiceChannel.id}>)`,
    });

    return interaction.reply({
      content: `Successfully invite \`${inviteUser.tag}\` to your voice channel`,
    });
  },
};
