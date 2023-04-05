const discord = require("discord.js");

module.exports = {
  name: "ping",
  category: "info",
  description: "봇의 핑을 보여줍니다",
  options: null,
  run: async (client, interaction, args) => {

    let start = Date.now();

    let embed1 = new discord.MessageEmbed()
    .setDescription("이글자 지워지는 속도가 곧 봇의 속도닷!! 끼야아호잇!")
    .setColor("RANDOM")

    await interaction.reply({
        embeds: [embed1],
        ephemeral: true
      })
        let end = Date.now();

        let embed = new discord.MessageEmbed()
        .addField("API 지연 시간", Math.round(client.ws.ping) + "ms", true)
        .addField("메시지 지연 시간", end - start + "ms", true)
        .setColor("RANDOM");
    
       interaction.editReply({ embeds: [embed] , ephemeral: true}).catch((e) => interaction.followUp(e));
  },
};
