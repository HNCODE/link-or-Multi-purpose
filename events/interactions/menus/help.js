const Discord = require('discord.js')
const prefixModel = require("../../../database/guildData/prefix");
const config = require('../../../config.json')

module.exports = async (interaction, client) => {
  if (!interaction.isSelectMenu()) return;

  if (interaction.customId === "help_menu") {
    const prefixData = await prefixModel.findOne({
      GuildID: interaction.guild.id,
    }).catch(err=>console.log(err))
  
    if (prefixData) {
      var PREFIX = prefixData.Prefix
    } else if (!prefixData) {
      PREFIX = config.PREFIX
    }

    if (interaction.values[0] === "home") {
      await interaction.deferUpdate()
      const settingsEmbed = new Discord.MessageEmbed()
      .setTitle("🏠 메인페이지")
      .setDescription('아래 메뉴에서 옵션을 선택하십시오!')
      .setColor("GREEN")
    
        await interaction.editReply({ embeds: [settingsEmbed] });
  
      } else if (interaction.values[0] === "prefixcmd") {
      await interaction.deferUpdate()
      const settingsEmbed = new Discord.MessageEmbed()
      .setColor("RANDOM")
      .setTitle("📔 접두사 명령어")
      const categories = ['LINK']
      const categoryToEmojiName = { LINK: '🌐 서버링크' }

      for (const category of categories) {
          const categoryToCommand = client.commands.filter(el => el.category === category).map(el => `${el.aliases[0]}<${el.name}>`)
          const categoryToCommands = categoryToCommand.length === 0 ? '`명령어가 존재하지 않아요!`' : `\`${categoryToCommand.join('`, `')}\``
          settingsEmbed.addFields({ name: `${categoryToEmojiName[category]}`, value: categoryToCommands },)
        }
  
        await interaction.editReply({ embeds: [settingsEmbed] });
  
      } else if (interaction.values[0] === "info") {

      await interaction.deferUpdate()
      const categoryToCommand = client.slash.filter(el => el.category === "info").map(el => `${el.name}`)
      const categoryToCommands = categoryToCommand.length === 0 ? '`명령어가 존재하지 않아요!`' : `\`${categoryToCommand.join('`, `')}\``

      const infoEmbed = new Discord.MessageEmbed()
        .setTitle("📋 정보")
        .setDescription(categoryToCommands)
        .setColor("RANDOM");

      await interaction.editReply({ embeds: [infoEmbed] })

    } else if (interaction.values[0] === "Mod") {
      await interaction.deferUpdate()
      const categoryToCommand = client.slash.filter(el => el.category === "Mod").map(el => `${el.name}`)
      const categoryToCommands = categoryToCommand.length === 0 ? '`명령어가 존재하지 않아요!`' : `접두사: ${PREFIX}\n\`${categoryToCommand.join('`, `')}\``

      const modEmbed = new Discord.MessageEmbed()
        .setTitle("🔧 관리자")
        .setDescription(categoryToCommands)
        .setColor("RANDOM");

      await interaction.editReply({ embeds: [modEmbed] })

    } else if (interaction.values[0] === "ticket") {
      await interaction.deferUpdate()
      const categoryToCommand = client.slash.filter(el => el.category === "ticket").map(el => `${el.name}`)
      const categoryToCommands = categoryToCommand.length === 0 ? '`명령어가 존재하지 않아요!`' : `\`${categoryToCommand.join('`, `')}\``

      const modEmbed = new Discord.MessageEmbed()
        .setTitle("🎫 티켓")
        .setDescription(categoryToCommands)
        .setColor("RANDOM");

      await interaction.editReply({ embeds: [modEmbed] })

    } else if (interaction.values[0] === "thread") {
      await interaction.deferUpdate()
      const categoryToCommand = client.slash.filter(el => el.category === "thread").map(el => `${el.name}`)
      const categoryToCommands = categoryToCommand.length === 0 ? '`명령어가 존재하지 않아요!`' : `\`${categoryToCommand.join('`, `')}\``

      const modEmbed = new Discord.MessageEmbed()
        .setTitle("💬 스레드(질문)")
        .setDescription(categoryToCommands)
        .setColor("RANDOM");

      await interaction.editReply({ embeds: [modEmbed] })

    } else if (interaction.values[0] === "Owner") {
      await interaction.deferUpdate()
      const categoryToCommand = client.slash.filter(el => el.category === "Owner").map(el => `${el.name}`)
      const categoryToCommands = categoryToCommand.length === 0 ? '`명령어가 존재하지 않아요!`' : `\`${categoryToCommand.join('`, `')}\``

      const modEmbed = new Discord.MessageEmbed()
        .setTitle("🔒 봇 오너")
        .setDescription(categoryToCommands)
        .setColor("RANDOM");

      await interaction.editReply({ embeds: [modEmbed] })

    } else if (interaction.values[0] === "Utility") {
      await interaction.deferUpdate()
      const categoryToCommand = client.slash.filter(el => el.category === "Utility").map(el => `${el.name}`)
      const categoryToCommands = categoryToCommand.length === 0 ? '`명령어가 존재하지 않아요!`' : `\`${categoryToCommand.join('`, `')}\``

      const utilityEmbed = new Discord.MessageEmbed()
        .setTitle("📐 유틸리티")
        .setDescription(categoryToCommands)
        .setColor("RANDOM");

      await interaction.editReply({ embeds: [utilityEmbed] })

    }
  }
}
