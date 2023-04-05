const inviteModel = require("../../../database/guildData/inviteRemove");

module.exports = {
  name: "invite-code",
  category: "Mod",
  description: "서버 초대 코드 생성 여부(ON/OFF) 설정합니다!",
  userPerms: ["MANAGE_GUILD"],
  options: [],
  run: async (client, interaction, args) => {
    const data = await inviteModel.findOne({
      GuildID: interaction.guild.id,
    });

    if (data) {
      await inviteModel.findOneAndRemove({
        GuildID: interaction.guild.id,
      });

      interaction.reply({content: `서버의 초대코드 생성을 **OFF**로 변경했습니다!`, ephemeral: true });

    } else if (!data) {
      interaction.reply({content: `서버의 초대코드 생성을 **ON**로 변경했습니다!`, ephemeral: true });

      let newData = new inviteModel({
        GuildID: interaction.guild.id,
      });
      newData.save();
    }
  },
};