const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");
const ExtendedClient = require("../../structures/extendedClient");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("access")
    .setDescription("Turn your voice channel public/private")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Name of the voice channel")
        .setRequired(true)
        .addChoices(
          { name: "public", value: "public" },
          { name: "private", value: "private" },
        )
    ),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {ExtendedClient} client
   */
  async execute(interaction, client) {
    const { member, guild } = interaction;
    const choice = interaction.options.get("choice");
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

    if (choice.value === "public") {
      guildVoiceChannel.permissionOverwrites.delete(guild.id);
    } else {
      guildVoiceChannel.permissionOverwrites.set([
        {
          id: guild.id,
          deny: PermissionFlagsBits.Connect,
        },
        {
          id: member.id,
          allow: PermissionFlagsBits.Connect,
        },
      ]);
    }

    return interaction.reply({
      content: `Your voice channel is now \`${choice.value}\``,
    });
  },
};
