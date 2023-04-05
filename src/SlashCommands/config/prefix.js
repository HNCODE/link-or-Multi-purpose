const prefixModel = require("../../../database/guildData/prefix");

module.exports = {
  name: "접두사",
  category: "Mod",
  description: "서버의 prefix를 설정합니다!",
  userPerms: ["MANAGE_GUILD"],
  options: [
{ name: "변경", description: "서버의 접두사를 변경합니다.", type: "SUB_COMMAND",
options: [{ name: "prefix", description: "최대 5글자", type: "STRING", required: true}]
}
],
  run: async (client, interaction, args) => {
    let PREFIX = await interaction.options.getString("prefix")

    const data = await prefixModel.findOne({
      GuildID: interaction.guild.id,
    });

    if (PREFIX.length > 5)
      return interaction.reply({content: "새 접두사(prefix)는 '5'자 미만이어야 합니다!", ephemeral: true });

    if (data) {
      await prefixModel.findOneAndRemove({
        GuildID: interaction.guild.id,
      });

      interaction.reply({content: `서버의 prefix를 **\`${args[0]}\`**로 변경했습니다!`, ephemeral: true });

      let newData = new prefixModel({
        Prefix: PREFIX,
        GuildID: interaction.guild.id,
      });
      newData.save();
    } else if (!data) {
      interaction.reply({content: `서버의 prefix를 **\`${args[0]}\`**로 변경했습니다!`, ephemeral: true });

      let newData = new prefixModel({
        Prefix: PREFIX,
        GuildID: interaction.guild.id,
      });
      newData.save();
    }
  },
};