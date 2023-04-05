const { CommandInteraction, MessageEmbed, ThreadManager } = require('discord.js')
const threadModel = require('../../../database/guildData/threadclosed')
module.exports = {
    name: "닫기",
    category: "thread",
    description: '질문 스레드를 닫을때 사용해주세요!',
    userPerms: [],
    options: [],  
  run: async(client, interaction, args) => {
     if(!interaction.channel.isThread()) {
             return interaction.reply({content: "해당 명령어는 스레드에서만 사용하실 수 있어요!", ephemeral: true})
         }
         const threadData = await threadModel.findOne({
          GuildID: interaction.guild.id,
          ChannelID: interaction.channel.id,
          OwnerID: interaction.member.id,
        }).catch(err=>console.log(err))

        const threadDatare = await threadModel.findOne({
          GuildID: interaction.guild.id,
          ChannelID: interaction.channel.id,
        }).catch(err=>console.log(err))

const thread = interaction.channel.parent.threads.cache.find(x => x.name === interaction.channel.name);
if (threadData) {
  if(interaction.member.permissions.has("ADMINISTRATOR")){
    let embed = new MessageEmbed()
    .setTitle("스레드를 닫았습니다.(BOT Owner)")
    .setColor("#A6A6A6");
    const threadchannel = client.channels.cache.get("947513919507947630");//스레드 관리자 권한으로 닫을 시 경고 알람 올라갈 채널
    if(threadchannel){
      const user = threadDatare.OwnerID
      await threadchannel.send(`-------------------------\n${user} - <@${user}>\n<#${interaction.channel.id}> \n관리자 권한으로 스레드 닫기 함. \n-------------------------`)
    }else if(!threadchannel){
      await interaction.channel.send(`-------------------------\n${user} - <@${user}>\n<#${interaction.channel.id}> \n관리자 권한으로 스레드 닫기 함. \n-------------------------`)
        }
        await interaction.reply({embeds: [embed]})
        await thread.edit({ archived: true, locked: true })
        await threadData.delete()
      }else {
        let embed = new MessageEmbed()
        .setTitle("스레드를 닫았습니다.")
        .setColor("#A6A6A6");
        
        await interaction.reply({embeds: [embed]})
        await thread.edit({ archived: true, locked: true })
        await threadData.delete()      
      }
} else if(!threadData){
if(interaction.member.permissions.has("ADMINISTRATOR")){
  let embed = new MessageEmbed()
  .setTitle("스레드를 닫았습니다.(BOT Owner)")
  .setColor("#A6A6A6");
        await interaction.channel.send(`-------------------------\n<#${interaction.channel.id}> \n관리자 권한으로 스레드 닫기 함. \n-------------------------`)
      await interaction.reply({embeds: [embed]})
      await thread.edit({ archived: true, locked: true })
    }else {
      return interaction.reply({content: "해당 스레드는 관리자만 닫을 수 있습니다!", ephemeral: true})
    }
  }
}
}