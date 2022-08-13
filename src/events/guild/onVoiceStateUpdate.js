const ExtendedClient = require("../../structures/extendedClient");
const { VoiceState, ChannelType, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "voiceStateUpdate",
  /**
   * @param {VoiceState} oldState
   * @param {VoiceState} newState
   * @param {ExtendedClient} client
   */
  async execute(oldState, newState, client) {
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const { member, guild } = newState;

    try {
      if (
        oldChannel !== newChannel &&
        newChannel &&
        newChannel.id === client.botConfig.voiceChannelId
      ) {
        const newVoiceChannel = await guild.channels.create({
          name: `${member.user.tag}`,
          type: ChannelType.GuildVoice,
          parent: client.botConfig.voiceChannelParentId,
          permissionOverwrites: [
            { id: member.id, allow: PermissionFlagsBits.Connect },
            { id: guild.id, deny: PermissionFlagsBits.Connect },
          ],
        });

        client.voiceChannels.set(member.id, newVoiceChannel.id);
        return setTimeout(() => member.voice.setChannel(newVoiceChannel), 500);
      }

      const voiceChannel = client.voiceChannels.get(member.id);
      const guildVoiceChannel = guild.channels.cache.get(voiceChannel);

      if (
        guildVoiceChannel &&
        voiceChannel &&
        oldChannel.id === voiceChannel &&
        (!newChannel || newChannel.id !== voiceChannel)
      ) {
        if (guildVoiceChannel.members.size === 0) {
          client.voiceChannels.set(member.id, null);
          return oldChannel.delete().catch(() => null);
        }

        const newVoiceMember = guildVoiceChannel.members.random();

        client.voiceChannels.set(member.id, null);
        client.voiceChannels.set(newVoiceMember.id, guildVoiceChannel.id);

        guildVoiceChannel.permissionOverwrites.delete(member.id);
        guildVoiceChannel.permissionOverwrites.edit(newVoiceMember.id, {
          Connect: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  },
};
