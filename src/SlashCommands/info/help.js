const { MessageEmbed, MessageActionRow, MessageSelectMenu} = require("discord.js");
const { owner } = require('../../../config.json');
module.exports = {
  name: "명령어",
  category: "info",
  description: "명령 목록 가져오기",
  options: [
    {
      name: "command",
      category: "info",
      description: "Get help for a command!",
      type: 'STRING',
      required: false
    }
  ],
  run: async (client, interaction, args) => {
    let commandInfo = await interaction.options.getString("command")

    if (commandInfo) {
      const qq = client.commands.filter(e => e.name === commandInfo||e.aliases.includes(commandInfo)).map(e => e.name)
      let cmd = client.commands.get(qq[0]);

      if (!cmd) {
        return interaction.reply("❌ 해당 명령어를 찾을 수 없습니다.")
      } else if (cmd) {
        let description = cmd.description ? cmd.description : "사용할 수 있는 설명이 없습니다.";
        let aliases = cmd.aliases ? cmd.aliases.join(", ") : "사용할 수 있는 보조 명령어가 없습니다.";
        let ownerOnly = cmd.ownerOnly ? "Yes" : "No";

        let helpEmbed = new MessageEmbed()
        .setTitle(`**${cmd.name}**에 대한 설명!`)
        .addField("명령어", `${cmd.name}`, true)
        .addField("보조 명령어", `${aliases}`, true)
        .addField("봇 오너 전용", `${ownerOnly}`, true)
        .addField("설명", `${description}`, false)
        .setColor("GREEN")

        return interaction.reply({ embeds: [helpEmbed], ephemeral: true });
      }
    } else {
      let moder 
      if(interaction.member.permissions.has("ADMINISTRATOR")){
        moder = [
          {
            label: "메인페이지",
            description: "홈(Home)",
            value: "home",
            emoji: "🏠"
          },
          {
            label: "서버링크",
            description: "접두사 명령어",
            value: "prefixcmd",
            emoji: "🌐"
          },
          {
            label: "티켓",
            description: "티켓 명령어",
            value: "ticket",
            emoji: "🎫"
          },
          {
            label: "스레드(질문)",
            description: "티켓 명령어",
            value: "thread",
            emoji: "💬"
          },
          {
            label: "정보",
            description: "정보 명령어",
            value: "info",
            emoji: "📋"
          },
          {
            label: "관리자",
            description: "관리자 명령어",
            value: "Mod",
            emoji: "🔧"
          },
          {
            label: "봇 오너",
            description: "모든 관리 명령어를 표시합니다",
            value: "Owner",
            emoji: "🔒"
          },
          {
            label: "유틸리티",
            description: "모든 Utility 명령어를 표시합니다.",
            value: "Utility",
            emoji: "📐"
          }
        ]
      }else{
        moder = [
          {
            label: "메인페이지",
            description: "홈(Home)",
            value: "home",
            emoji: "🏠"
          },
          {
            label: "정보",
            description: "정보 명령어",
            value: "info",
            emoji: "📋"
          },
          {
            label: "유틸리티",
            description: "모든 Utility 명령어를 표시합니다.",
            value: "Utility",
            emoji: "📐"
          }
        ]  
      }
    let helpMenu = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
      .setCustomId("help_menu")
      .setPlaceholder('Help Menu')
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(moder)
    )

    let helpEmbed = new MessageEmbed()
    .setTitle('🏠 메인페이지')
    .setDescription('아래 메뉴에서 옵션을 선택하십시오!')
    .setColor("GREEN")

    interaction.reply({ embeds: [helpEmbed], components: [helpMenu], ephemeral: true})
    }
  }
};
