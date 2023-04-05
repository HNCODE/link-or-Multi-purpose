const IJRModel = require("../../../database/guildData/inviteJoinRole");

module.exports = {
  name: "join-role",
  category: "Mod",
  description: "서버 링크 입장시 얻는 역할!",
  userPerms: ["MANAGE_GUILD"],
  options: [
    { name: "role", description: "역할을 적어주세요.", type: "ROLE", required: false}
  ],
  run: async (client, interaction, args) => {
    let Role = await interaction.options.getRole("role")

    const data = await IJRModel.findOne({
      GuildID: interaction.guild.id,
    });
   if(!Role){
    await IJRModel.findOneAndRemove({
      GuildID: interaction.guild.id,
    });

    interaction.reply({content: `서버 입장시 역할 획득 **OFF**!`, ephemeral: true });
   } else if(Role){
    if (data) {
      await IJRModel.findOneAndRemove({
        GuildID: interaction.guild.id,
      });
      let newData = new IJRModel({
        GuildID: interaction.guild.id,
        Role: Role.id,
      });
      newData.save();
      interaction.reply({content: `서버 입장시 역할: **${Role}** 얻습니다!`, ephemeral: true });

    } else if (!data) {
      interaction.reply({content: `서버 입장시 역할: **${Role}** 얻습니다!`, ephemeral: true });

      let newData = new IJRModel({
        GuildID: interaction.guild.id,
        Role: Role.id,
      });
      newData.save();
    }
  }
  },
};